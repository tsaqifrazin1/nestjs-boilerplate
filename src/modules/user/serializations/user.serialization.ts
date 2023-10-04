import { faker } from '@faker-js/faker';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';
import { IsEnum, IsString, Validate, ValidateIf } from 'class-validator';
import { RoleType, UserType } from 'src/common/type';
import { OrganizationEntity } from 'src/modules/organizations/entities';
import { OrganizationGetSerialization } from 'src/modules/organizations/serializations/organizations.serialization';

export class UserGetSerialization {
  @ApiProperty({
    description: 'id',
    example: faker.number.int({ min: 1, max: 999 }),
  })
  id: number;

  @ApiProperty({
    description: 'username',
    example: faker.internet.userName(),
  })
  username: string;

  @ApiProperty({
    description: 'phoneNumber user',
    example: faker.phone.number(),
  })
  phoneNumber: string;

  @ApiProperty({
    description: 'email',
    example: faker.internet.email(),
  })
  email: string;

  @ApiProperty({
    type: 'enum',
    enum: UserType,
    description: 'user type',
    example: UserType.PLN,
  })
  userType: UserType;

  @ApiProperty({
    type: 'enum',
    enum: RoleType,
    description: 'role type',
    example: RoleType.PLN_ADMIN,
  })
  role: RoleType;

  @ApiProperty({
    example: faker.date.recent(),
  })
  createdAt: Date;

  @ApiProperty({
    example: faker.date.recent(),
  })
  updatedAt: Date;

  @Exclude()
  deletedAt: Date;

  @Exclude()
  readonly password: string;

  @ApiProperty({
    type: () => OrganizationGetSerialization,
  })
  @Type(() => OrganizationGetSerialization)
  readonly organization: OrganizationGetSerialization;
}

export class UserWithoutOrganizations extends OmitType(UserGetSerialization, [
  'organization',
] as const) {}

export class UserWithoutOrganizationsAndMitra extends OmitType(
  UserGetSerialization,
  ['organization'] as const,
) {}
