import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'password',
  })
  @IsString()
  password: string;
}
