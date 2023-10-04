import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  SetMetadata,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { OrganizationsService } from '../service';
import { DataSource } from 'typeorm';
import {
  CreateOrganizationDto,
  OrganizationsDto,
  UpdateOrganizationDto,
} from '../dto';
import { JwtAuthGuard } from 'src/modules/auth/guard';
import { RolesTypeGuard } from 'src/guards';
import { RolesTypeDecorators } from 'src/decorators/roles-type.decorator';
import { RoleType } from 'src/common/type';
import { TransformResponseInterceptor } from 'src/interceptors';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OrganizationEntity } from '../entities';
import {
  OrganizationCreateDoc,
  OrganizationDeleteDoc,
  OrganizationReadAllDoc,
  OrganizationReadOneDoc,
  OrganizationUpdateDoc,
} from '../docs';
import { IResponse, Response } from 'src/common/response';
import { OrganizationGetSerialization } from '../serializations/organizations.serialization';
import { ORGANIZATION_STATUS_CODE_ERRORS } from '../constants/organizations.status-code.constants';
import { ORGANIZATION_MESSAGE_RESPONSE } from '../constants/organizations.message.constants';

@Controller('organizations')
@ApiTags('Organizations')
export class OrganizationsController {
  constructor(
    private readonly _organizationsService: OrganizationsService,
    private readonly dataSource: DataSource,
  ) {}

  @Post()
  @OrganizationCreateDoc([
    {
      statusCode:
        ORGANIZATION_STATUS_CODE_ERRORS.ORGANIZATION_AREA_ALREADY_EXISTS,
      message: ORGANIZATION_MESSAGE_RESPONSE.ORGANIZATION_AREA_ALREADY_EXISTS,
      description: 'Organization area already exists',
      requestUrl: '/organizations',
    },
    {
      statusCode:
        ORGANIZATION_STATUS_CODE_ERRORS.ORGANIZATION_AREA_NUMBER_ALREADY_EXISTS,
      message:
        ORGANIZATION_MESSAGE_RESPONSE.ORGANIZATION_AREA_NUMBER_ALREADY_EXISTS,
      description: 'Organization area number already exists',
      requestUrl: '/organizations',
    },
  ])
  @Response()
  @UseGuards(JwtAuthGuard, RolesTypeGuard)
  @RolesTypeDecorators(RoleType.PLN_SUPERADMIN)
  @ApiBearerAuth()
  async createOrganization(
    @Body() organizationDto: CreateOrganizationDto,
  ): Promise<IResponse<void>> {
    await this._organizationsService.createOrganization(organizationDto);

    return {
      message: ORGANIZATION_MESSAGE_RESPONSE.ORGANIZATION_CREATED_SUCCESSFULLY,
    };
  }

  @Get()
  @OrganizationReadAllDoc<OrganizationGetSerialization>(
    OrganizationGetSerialization,
  )
  @Response({ serialization: OrganizationGetSerialization })
  async getAllOrganizations(): Promise<IResponse<OrganizationEntity>> {
    const organizations =
      await this._organizationsService.getAllOrganizations();

    return {
      message: ORGANIZATION_MESSAGE_RESPONSE.ORGANIZATION_READ_ALL_SUCCESSFULLY,
      data: organizations,
    };
  }

  @Get(':id')
  @OrganizationReadOneDoc<OrganizationGetSerialization>(
    OrganizationGetSerialization,
  )
  @Response({ serialization: OrganizationGetSerialization })
  async getOrganizationById(
    @Param('id') id: number,
  ): Promise<IResponse<OrganizationEntity>> {
    const organization = await this._organizationsService.getOrganizationById(
      id,
    );

    return {
      message: ORGANIZATION_MESSAGE_RESPONSE.ORGANIZATION_READ_ONE_SUCCESSFULLY,
      data: organization,
    };
  }

  @Patch(':id')
  @OrganizationUpdateDoc([
    {
      message: ORGANIZATION_MESSAGE_RESPONSE.ORGANIZATION_NOT_FOUND,
      statusCode: ORGANIZATION_STATUS_CODE_ERRORS.ORGANIZATION_NOT_FOUND,
      description: 'Organization not found',
      requestUrl: '/organizations/:id',
    },
  ])
  @Response()
  @UseGuards(JwtAuthGuard, RolesTypeGuard)
  @RolesTypeDecorators(RoleType.PLN_SUPERADMIN)
  @ApiBearerAuth()
  async updateOrganization(
    @Param('id') id: number,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ): Promise<IResponse<void>> {
    const organization = await this._organizationsService.getOrganizationById(
      id,
    );
    if (!organization) {
      throw new NotFoundException({
        message: ORGANIZATION_MESSAGE_RESPONSE.ORGANIZATION_NOT_FOUND,
        statusCode: ORGANIZATION_STATUS_CODE_ERRORS.ORGANIZATION_NOT_FOUND,
      });
    }

    await this._organizationsService.updateOrganization(
      id,
      updateOrganizationDto,
    );

    return {
      message: ORGANIZATION_MESSAGE_RESPONSE.ORGANIZATION_UPDATED_SUCCESSFULLY,
    };
  }

  @Delete(':id')
  @Response()
  @OrganizationDeleteDoc([
    {
      message: ORGANIZATION_MESSAGE_RESPONSE.ORGANIZATION_NOT_FOUND,
      statusCode: ORGANIZATION_STATUS_CODE_ERRORS.ORGANIZATION_NOT_FOUND,
      description: 'Organization not found',
      requestUrl: '/organizations/:id',
    },
  ])
  @UseGuards(JwtAuthGuard, RolesTypeGuard)
  @RolesTypeDecorators(RoleType.PLN_SUPERADMIN)
  @ApiBearerAuth()
  async deleteOrganization(@Param('id') id: number): Promise<IResponse<void>> {
    const organization = await this._organizationsService.getOrganizationById(
      id,
    );
    if (!organization) {
      throw new NotFoundException({
        message: ORGANIZATION_MESSAGE_RESPONSE.ORGANIZATION_NOT_FOUND,
        statusCode: ORGANIZATION_STATUS_CODE_ERRORS.ORGANIZATION_NOT_FOUND,
      });
    }

    await this._organizationsService.deleteOrganization(id);

    return {
      message: ORGANIZATION_MESSAGE_RESPONSE.ORGANIZATION_DELETED_SUCCESSFULLY,
    };
  }
}
