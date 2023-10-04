import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class FileTypeDto {
  @ApiProperty({
    description: 'File type',
  })
  @IsString()
  type: string;
}
