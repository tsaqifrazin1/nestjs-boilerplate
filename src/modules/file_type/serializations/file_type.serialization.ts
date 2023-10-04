import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';

export class FileTypeSerialization {
  @ApiProperty({
    example: faker.string.numeric(12),
  })
  id: number;

  @ApiProperty({
    description: 'File type',
  })
  type: string;

  @ApiProperty({
    example: faker.date.recent(),
  })
  createdAt: Date;

  @ApiProperty({
    example: faker.date.recent(),
  })
  updatedAt: Date;
}
