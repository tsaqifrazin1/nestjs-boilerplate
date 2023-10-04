import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { UserType } from 'src/common/type';

export class QueryRoleLovDto {
  @ApiPropertyOptional({
    description: 'user type',
    enum: UserType,
  })
  @IsOptional()
  @IsEnum(UserType)
  userType: UserType;
}
