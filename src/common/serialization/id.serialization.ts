import { ApiProperty } from "@nestjs/swagger";

export class IdSerialization {
  @ApiProperty({
    example: 1
  })
  id: number;
}