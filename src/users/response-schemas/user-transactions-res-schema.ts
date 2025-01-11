import { ApiProperty } from '@nestjs/swagger';

class Transaction {
  @ApiProperty({ example: '67715cf77ebfea5de7f21489' })
  _id: string;

  @ApiProperty({ example: 'EGP' })
  sourceCurrency: string;

  @ApiProperty({ example: 'USD' })
  targetCurrency: string;

  @ApiProperty({ example: 7000 })
  amount: number;

  @ApiProperty({ example: 137.62 })
  convertedAmount: number;

  @ApiProperty({ example: '677156ae1d3fc120d411f8ba' })
  user: string;

  @ApiProperty({ example: 'eb2a62a9-d407-41cb-98b0-37cbbf648162' })
  requestId: string;

  @ApiProperty({ example: 0 })
  __v: number;

  @ApiProperty({
    example: '2024-12-29T21:07:05.903Z',
    required: false,
  })
  createdAt?: string;

  @ApiProperty({
    example: '2024-12-29T21:07:05.903Z',
    required: false,
  })
  updatedAt?: string;
}

export class UserHistoryResponse {
  @ApiProperty({ example: '677156ae1d3fc120d411f8ba' })
  _id: string;

  @ApiProperty({ example: 'hassan' })
  username: string;

  @ApiProperty({ example: 90 })
  transactionCount: number;

  @ApiProperty({ type: [Transaction] })
  transactions: Transaction[];
}
