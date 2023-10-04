import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';
import { IsString, IsNumber } from 'class-validator';
import { faker } from '@faker-js/faker';

export class OrganizationGetSerialization {
  @ApiProperty({
    example: faker.number.int({ min: 1, max: 999 }),
  })
  id: number;

  @ApiProperty({
    example: faker.company.name().toUpperCase(),
  })
  name: string;

  @ApiProperty({
    example: faker.lorem.words(2).toUpperCase(),
  })
  serviceName: string;

  @ApiProperty({
    example: faker.lorem.words(1).toUpperCase(),
  })
  shortName: string;

  @ApiProperty({
    example: faker.lorem.words(1).toUpperCase(),
  })
  area: string;

  @ApiProperty({
    example: faker.number.int({ min: 100, max: 999 }),
  })
  areaNumber: number;

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
}
