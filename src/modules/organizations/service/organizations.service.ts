import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionFor } from 'nest-transact';
import { OrganizationEntity } from '../entities';
import { QueryFailedError, Repository } from 'typeorm';
import { ModuleRef } from '@nestjs/core';
import {
  CreateOrganizationDto,
  OrganizationsDto,
  UpdateOrganizationDto,
} from '../dto';
import { ORGANIZATION_STATUS_CODE_ERRORS } from '../constants/organizations.status-code.constants';
import { ORGANIZATION_MESSAGE_RESPONSE } from '../constants/organizations.message.constants';

@Injectable()
export class OrganizationsService extends TransactionFor<OrganizationsService> {
  constructor(
    @InjectRepository(OrganizationEntity)
    private readonly _organizationsService: Repository<OrganizationEntity>,
    moduleRef: ModuleRef,
  ) {
    super(moduleRef);
  }

  async createOrganization(
    organizationDto: CreateOrganizationDto,
  ): Promise<void> {
    const organization = this._organizationsService.create(organizationDto);
    try {
      await this._organizationsService.save(organization);
    } catch (error) {
      this._errorHandler(error);
    }
  }

  async getAllOrganizations(): Promise<OrganizationEntity[]> {
    return this._organizationsService
      .createQueryBuilder('organization')
      .getMany();
  }

  async getOrganizationById(id: number): Promise<OrganizationEntity> {
    return this._organizationsService
      .createQueryBuilder('organization')
      .where('organization.id = :id', { id })
      .getOne();
  }

  async getOrganizationByAreaNumber(
    areaNumber: number,
  ): Promise<OrganizationEntity> {
    return this._organizationsService
      .createQueryBuilder('organization')
      .where('organization.areaNumber = :areaNumber', { areaNumber })
      .getOne();
  }

  async updateOrganization(
    id: number,
    updateOrganizationDto: UpdateOrganizationDto,
  ): Promise<void> {
    try {
      await this._organizationsService.update(id, updateOrganizationDto);
    } catch (error) {
      this._errorHandler(error);
    }
  }

  async deleteOrganization(id: number): Promise<void> {
    await this._organizationsService.softDelete(id);
  }

  _errorHandler(error: any) {
    if (error.code === '23505') {
      switch (error.constraint) {
        case 'UQ_01669b7b74ef2b23b904f15982e':
          throw new BadRequestException({
            statusCode:
              ORGANIZATION_STATUS_CODE_ERRORS.ORGANIZATION_AREA_ALREADY_EXISTS,
            message:
              ORGANIZATION_MESSAGE_RESPONSE.ORGANIZATION_AREA_ALREADY_EXISTS,
          });
        case 'UQ_caaed8b231e9d68b5087dc7cc53':
          throw new BadRequestException({
            statusCode:
              ORGANIZATION_STATUS_CODE_ERRORS.ORGANIZATION_AREA_NUMBER_ALREADY_EXISTS,
            message:
              ORGANIZATION_MESSAGE_RESPONSE.ORGANIZATION_AREA_NUMBER_ALREADY_EXISTS,
          });
      }
    }
    throw new QueryFailedError(
      error.query,
      error.parameters,
      error.driverError,
    );
  }

  async getOrganizationByUnitUpAp2t(
    unitUp: string,
  ): Promise<OrganizationEntity> {
    let organization: OrganizationEntity = null;
    switch (unitUp) {
      case '15100':
        organization = await this.getOrganizationByAreaNumber(100);
        break;
      case '15200':
        organization = await this.getOrganizationByAreaNumber(200);
        break;
      case '15300':
        organization = await this.getOrganizationByAreaNumber(300);
        break;
      case '15400':
        organization = await this.getOrganizationByAreaNumber(400);
        break;
    }
    return organization;
  }

  async getOrganizationByName(name: string): Promise<OrganizationEntity> {
    return this._organizationsService
      .createQueryBuilder('organization')
      .where('organization.name = :name', { name })
      .getOne();
  }
}
