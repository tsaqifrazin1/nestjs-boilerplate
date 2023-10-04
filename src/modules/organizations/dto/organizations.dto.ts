import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class OrganizationsDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  serviceName: string;

  @ApiProperty()
  @IsString()
  shortName: string;

  @ApiProperty()
  @IsString()
  area: string;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  areaNumber: number;
}
