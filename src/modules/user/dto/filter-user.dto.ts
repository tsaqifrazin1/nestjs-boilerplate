import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { QueryParams } from 'src/common/dto/query-params.dto';
import { MitraType, RoleType, UserType } from 'src/common/type';

export class UserFilterDto extends QueryParams {
  @ApiPropertyOptional({
    description: 'user id',
  })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  id?: number;

  @ApiPropertyOptional({
    description: 'user name',
  })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiPropertyOptional({
    description: 'user email',
  })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({
    enum: RoleType,
  })
  @IsOptional()
  @IsEnum(RoleType)
  role?: string;

  @ApiPropertyOptional({
    description: 'user mitra type',
    enum: MitraType,
  })
  @IsOptional()
  @IsEnum(MitraType)
  mitraType?: string;

  @ApiPropertyOptional({
    description: 'user mitra id',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  mitraId?: number;

  @ApiPropertyOptional({
    description: 'user type',
    enum: UserType,
  })
  @IsOptional()
  @IsEnum(UserType)
  userType?: UserType;

  @ApiPropertyOptional({
    description: 'user organization id',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  organizationId?: number;

  @ApiPropertyOptional({
    description: 'user organization name',
  })
  @IsOptional()
  @IsString()
  organizationName?: string;

  @ApiPropertyOptional({
    type: 'boolean',
    description: 'is LOV for surveyor?',
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  isLovSurveyor?: boolean;
}
