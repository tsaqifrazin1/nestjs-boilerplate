import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Patch,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from '../services';
import { TransformResponseInterceptor } from 'src/interceptors';
import { JwtAuthGuard } from 'src/modules/auth/guard';
import { RolesTypeGuard } from 'src/guards';
import { RolesTypeDecorators } from 'src/decorators/roles-type.decorator';
import { RoleType } from 'src/common/type';
import { ChangePasswordDto, UpdateUserDto, UserFilterDto } from '../dto';
import { AuthUser } from 'src/decorators';
import { UserEntity } from '../entitites';
import { OrganizationsService } from 'src/modules/organizations/service';
import * as _ from 'lodash';
import { OrganizationEntity } from 'src/modules/organizations/entities';
import {
  UserDeleteDoc,
  UserReadAllDoc,
  UserReadOneDoc,
  UserRestoreDoc,
  UserUpdateDoc,
} from '../docs';
import { UserGetSerialization } from '../serializations/user.serialization';
import { Response } from 'src/common/response';
import { USER_STATUS_CODE_ERRORS } from '../constants/users.status-code.constants';
import { ORGANIZATION_STATUS_CODE_ERRORS } from 'src/modules/organizations/constants/organizations.status-code.constants';
import { USER_MESSAGE_RESPONSE } from '../constants/user.message.constants';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(
    private readonly _userService: UserService,
    private readonly _organizationService: OrganizationsService,
  ) {}

  @Get()
  @Response({ serialization: UserGetSerialization })
  @UserReadAllDoc<UserGetSerialization>(UserGetSerialization)
  @UseInterceptors(TransformResponseInterceptor)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'All role',
    description: 'get all user',
  })
  @ApiBearerAuth()
  async getUser(
    @Query() userFilterDto: UserFilterDto,
    @AuthUser() user: UserEntity,
  ) {
    const users = await this._userService.getUser(userFilterDto, user);
    return {
      message: USER_MESSAGE_RESPONSE.USER_READ_ALL_SUCCESSFULLY,
      data: users,
    };
  }

  @Get(':id')
  @Response({ serialization: UserGetSerialization })
  @UserReadOneDoc<UserGetSerialization>(UserGetSerialization, [
    {
      message: USER_MESSAGE_RESPONSE.USER_CANT_GET_OTHER_USER,
      description: 'Cant get other user data except the user itself',
      statusCode: USER_STATUS_CODE_ERRORS.USER_FORBIDDEN_ACCESS_DATA,
      requestUrl: '/user/:id',
    },
  ])
  @UseInterceptors(TransformResponseInterceptor)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'All user',
    description: 'get user by id',
  })
  @ApiBearerAuth()
  async getUserById(@Param('id') id: number, @AuthUser() user: UserEntity) {
    if (user.role !== RoleType.PLN_SUPERADMIN && user.id !== id) {
      throw new ForbiddenException({
        message: USER_MESSAGE_RESPONSE.USER_CANT_GET_OTHER_USER,
        statusCode: USER_STATUS_CODE_ERRORS.USER_FORBIDDEN_ACCESS_DATA,
      });
    }
    const result = await this._userService.getUserById(id);
    return {
      message: USER_MESSAGE_RESPONSE.USER_READ_ONE_SUCCESSFULLY,
      data: result,
    };
  }

  @Put(':id')
  @Response()
  @UserUpdateDoc([
    {
      message: USER_MESSAGE_RESPONSE.USER_NOT_FOUND,
      description: USER_MESSAGE_RESPONSE.USER_NOT_FOUND,
      statusCode: USER_STATUS_CODE_ERRORS.USER_NOT_FOUND,
      requestUrl: '/user/:id',
    },
    {
      message: 'Organization not found',
      description: 'Organization not found',
      statusCode: ORGANIZATION_STATUS_CODE_ERRORS.ORGANIZATION_NOT_FOUND,
      requestUrl: '/user/:id',
    },
  ])
  @UseInterceptors(TransformResponseInterceptor)
  @UseGuards(JwtAuthGuard, RolesTypeGuard)
  @RolesTypeDecorators(RoleType.PLN_SUPERADMIN)
  @ApiOperation({
    summary: 'SUPERADMIN only',
    description: 'update user',
  })
  @ApiBearerAuth()
  async updateUser(
    @Param('id') id: number,
    @Body() updatedUser: UpdateUserDto,
  ) {
    const user = await this._userService.getUserById(id);
    if (!user) {
      throw new NotFoundException({
        message: USER_MESSAGE_RESPONSE.USER_NOT_FOUND,
        statusCode: USER_STATUS_CODE_ERRORS.USER_NOT_FOUND,
      });
    }

    let organization: OrganizationEntity;
    if (updatedUser.organizationId) {
      organization = await this._organizationService.getOrganizationById(
        updatedUser.organizationId,
      );
      if (!organization) {
        throw new NotFoundException({
          message: 'Organization not found',
          statusCode: ORGANIZATION_STATUS_CODE_ERRORS.ORGANIZATION_NOT_FOUND,
        });
      }

      const { title, shortTitle } =
        await this._userService.getTitleAndShortTitle(
          user.role,
          organization.area,
        );
      (updatedUser as any).title = title;
      (updatedUser as any).shortTitle = shortTitle;
    }
    const updatedUserDto = _.omit(updatedUser, ['mitraId', 'organizationId']);
    await this._userService.updateUser(id, updatedUserDto);
    return {
      message: USER_MESSAGE_RESPONSE.USER_UPDATED_SUCCESSFULLY,
    };
  }

  @Delete(':id')
  @Response()
  @UserDeleteDoc([
    {
      message: USER_MESSAGE_RESPONSE.USER_NOT_FOUND,
      description: USER_MESSAGE_RESPONSE.USER_NOT_FOUND,
      statusCode: USER_STATUS_CODE_ERRORS.USER_NOT_FOUND,
      requestUrl: '/user/:id',
    },
  ])
  @UseInterceptors(TransformResponseInterceptor)
  @UseGuards(JwtAuthGuard, RolesTypeGuard)
  @RolesTypeDecorators(RoleType.PLN_SUPERADMIN)
  @ApiOperation({
    summary: 'SUPERADMIN only',
    description: 'delete user',
  })
  @ApiBearerAuth()
  async deleteUser(@Param('id') id: number) {
    const user = await this._userService.getUserById(id);
    if (!user)
      throw new NotFoundException({
        message: USER_MESSAGE_RESPONSE.USER_NOT_FOUND,
        statusCode: USER_STATUS_CODE_ERRORS.USER_NOT_FOUND,
      });

    await this._userService.deleteUser(id);
    return {
      message: USER_MESSAGE_RESPONSE.USER_DELETED_SUCCESSFULLY,
    };
  }

  @Patch(':id/restore')
  @Response()
  @UserRestoreDoc([
    {
      message: USER_MESSAGE_RESPONSE.USER_NOT_FOUND,
      description: USER_MESSAGE_RESPONSE.USER_NOT_FOUND,
      statusCode: USER_STATUS_CODE_ERRORS.USER_NOT_FOUND,
      requestUrl: '/user/:id',
    },
  ])
  @UseInterceptors(TransformResponseInterceptor)
  @UseGuards(JwtAuthGuard, RolesTypeGuard)
  @RolesTypeDecorators(RoleType.PLN_SUPERADMIN)
  @ApiOperation({
    summary: 'SUPERADMIN only',
    description: 'restore user',
  })
  @ApiBearerAuth()
  async restoreUser(@Param('id') id: number) {
    const user = await this._userService.getUserById(id, { withDeleted: true });
    if (!user)
      throw new NotFoundException({
        message: USER_MESSAGE_RESPONSE.USER_NOT_FOUND,
        statusCode: USER_STATUS_CODE_ERRORS.USER_NOT_FOUND,
      });

    await this._userService.restoreUser(id);
    return {
      message: USER_MESSAGE_RESPONSE.USER_RESTORED_SUCCESSFULLY,
    };
  }

  @Patch(':id/change-password')
  @UseInterceptors(TransformResponseInterceptor)
  @UseGuards(JwtAuthGuard, RolesTypeGuard)
  @ApiOperation({
    summary: 'SUPERADMIN only',
    description: 'change password user',
  })
  @ApiBearerAuth()
  async changePassword(
    @Param('id') id: number,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    const user = await this._userService.getUserById(id);
    if (!user) {
      throw new NotFoundException({
        message: USER_MESSAGE_RESPONSE.USER_NOT_FOUND,
        statusCode: USER_STATUS_CODE_ERRORS.USER_NOT_FOUND,
      });
    }
    await this._userService.changePassword(id, changePasswordDto.password);
    return {
      message: USER_MESSAGE_RESPONSE.USER_CHANGE_PASSWORD_SUCCESSFULLY,
    };
  }
}
