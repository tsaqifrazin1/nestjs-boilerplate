import { ApiProperty } from '@nestjs/swagger';

export class MetaDto {
  @ApiProperty()
  page: number;
  @ApiProperty()
  offset: number;
  @ApiProperty()
  itemCount: number;
  @ApiProperty()
  pageCount: number;
}
