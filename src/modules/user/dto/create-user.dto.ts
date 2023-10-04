import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserDto } from './user.dto';
import { Type } from 'class-transformer';
import { IsNumber, ValidateIf } from 'class-validator';
import { UserType } from 'src/common/type';

export class CreateUserDto extends UserDto {
  @ApiPropertyOptional({
    description: 'mitra id',
  })
  @ValidateIf((o) => o.userType === UserType.MITRA)
  @Type(() => Number)
  @IsNumber()
  mitraId?: number;

  @ApiPropertyOptional({
    description: 'organization id',
  })
  @ValidateIf(
    (o) => o.userType === UserType.PLN || o.userType === UserType.OUTSOURCE,
  )
  @Type(() => Number)
  @IsNumber()
  organizationId?: number;
}
