import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, Validate, ValidateIf } from 'class-validator';
import { RoleType, UserType } from 'src/common/type';
import { OrganizationEntity } from 'src/modules/organizations/entities';

export class UserDto {
  @ApiProperty({
    description: 'username',
  })
  @IsString()
  username: string;

  @ApiProperty({
    description: 'phoneNumber user',
  })
  @IsString()
  phoneNumber: string;

  @ApiProperty({
    description: 'email',
  })
  @IsString()
  email: string;

  @ApiProperty({
    type: 'enum',
    enum: UserType,
    description: 'user type',
  })
  @IsEnum(UserType)
  userType: UserType;

  @ApiProperty({
    type: 'enum',
    enum: RoleType,
    description: 'role type',
  })
  @ValidateIf((o) => {
    return o.userType !== UserType.MITRA;
  })
  @IsEnum(RoleType)
  role?: RoleType;

  organization?: OrganizationEntity;
  password: string;
}
