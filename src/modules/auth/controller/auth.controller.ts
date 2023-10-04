import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService, LdapService } from '../service';
import { TransformResponseInterceptor } from 'src/interceptors';
import { CreateUserDto } from 'src/modules/user/dto';
import { UserService } from 'src/modules/user/services';
import { LoginDto, QueryRoleLovDto } from '../dto';
import * as bcrypt from 'bcrypt';
import { RolesTypeDecorators } from 'src/decorators/roles-type.decorator';
import { RoleType } from 'src/common/type';
import { RolesTypeGuard } from 'src/guards';
import { JwtAuthGuard } from '../guard';
import { OrganizationsService } from 'src/modules/organizations/service';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private readonly _ldapService: LdapService,
    private readonly _userService: UserService,
    private readonly _organizationService: OrganizationsService,
    private readonly _authService: AuthService,
  ) {}

  @Get('ldap')
  async ldap() {
    const result = await this._ldapService.search('tsaqif razin');
    return result;
  }

  @Post('register')
  @UseInterceptors(TransformResponseInterceptor)
  @ApiOperation({
    summary: 'SUPERADMIN only',
    description: 'register user',
  })
  @UseGuards(JwtAuthGuard, RolesTypeGuard)
  @RolesTypeDecorators(RoleType.PLN_SUPERADMIN)
  @ApiBearerAuth()
  async createUser(@Body() user: CreateUserDto) {
    if (user.organizationId) {
      const organization = await this._organizationService.getOrganizationById(
        user.organizationId,
      );
      if (!organization) {
        throw new NotFoundException('Organization not found');
      }
      user.organization = organization;
      const { title, shortTitle } =
        await this._userService.getTitleAndShortTitle(
          user.role,
          organization.area,
        );
      (user as any).title = title;
      (user as any).shortTitle = shortTitle;
    }

    const roles = await this._authService.lovRoleType(user.userType);
    if (!roles.includes(user.role)) {
      throw new BadRequestException('Invalid role');
    }

    user.password = user.phoneNumber;
    await this._userService.createUser(user);
    return {
      message: 'success create user',
    };
  }

  @Post('login')
  @ApiOperation({
    summary: 'No Auth',
    description: 'Login user with email and password to get jwt token',
  })
  @UseInterceptors(TransformResponseInterceptor)
  async login(@Body() userLogin: LoginDto) {
    const user = await this._userService.getUserByEmailAndOrUserType(
      userLogin.email,
    );
    if (!user) {
      throw new NotFoundException('Invalid credentials');
    }
    if (!bcrypt.compareSync(userLogin.password, user.password)) {
      throw new BadRequestException('invalid credentials');
    }
    const token = await this._authService.generateJwt(user);
    const decode = await this._authService.decodeUser(token);
    decode['token'] = token;
    return {
      message: 'success login',
      data: {
        user: decode,
      },
    };
  }

  @Get('roles')
  @UseInterceptors(TransformResponseInterceptor)
  @ApiOperation({
    summary: 'No Auth',
    description: 'get all roles',
  })
  async getRoles(@Query() queryRoleLovDto: QueryRoleLovDto) {
    const roles = await this._authService.lovRoleType(queryRoleLovDto.userType);
    return {
      message: 'success get roles',
      data: roles,
    };
  }
}
