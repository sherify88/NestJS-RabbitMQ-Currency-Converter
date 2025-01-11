import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({
    description: 'The username of the user',
    example: 'john_doe',
  })
  @IsNotEmpty()
  @IsString()
  readonly username: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'securePassword123',
  })
  @IsNotEmpty()
  readonly password: string;
}
