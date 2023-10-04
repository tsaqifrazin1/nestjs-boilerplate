import { ApiProperty } from '@nestjs/swagger';
import { MetaDto } from './meta.dto';

export class PaginationDto<T> {
  @ApiProperty()
  entities: T[];
  @ApiProperty()
  meta: MetaDto;
}
