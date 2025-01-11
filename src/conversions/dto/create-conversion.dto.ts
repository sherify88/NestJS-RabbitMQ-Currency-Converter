import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateConversionDto {
  @ApiProperty({
    description: 'The currency to convert from (e.g., USD)',
    example: 'USD',
  })
  @IsNotEmpty()
  @IsString()
  sourceCurrency: string;

  @ApiProperty({
    description: 'The currency to convert to (e.g., EUR)',
    example: 'EUR',
  })
  @IsNotEmpty()
  @IsString()
  targetCurrency: string;

  @ApiProperty({
    description: 'The amount to convert',
    example: 100,
  })
  @IsNotEmpty()
  amount: number;


    userId: string;


    requestId: string;




}
