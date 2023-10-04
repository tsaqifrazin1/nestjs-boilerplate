import { PartialType } from '@nestjs/swagger';
import { OrganizationsDto } from './organizations.dto';

export class UpdateOrganizationDto extends PartialType(OrganizationsDto) {}
