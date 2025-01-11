import { ApiProperty } from '@nestjs/swagger';
import { ErrorTypeConversionApi } from '../exchange-api-interfaces';

export class ConversionTransaction {
  @ApiProperty({ example: 'EGP' })
  sourceCurrency: string;

  @ApiProperty({ example: 'USD' })
  targetCurrency: string;

  @ApiProperty({ example: 14000 })
  amount: number;

  @ApiProperty({ example: 275.24 })
  convertedAmount: number;

  @ApiProperty({ example: '677156ae1d3fc120d411a' })
  user: string;

  @ApiProperty({ example: '7723a1c6-4fbc-46b7-a8f1-d159126f0' })
  requestId: string;

  @ApiProperty({ example: '6771dcf3fe5409fae61b4a' })
  _id: string;

  @ApiProperty({ example: '2024-12-29T23:36:19.080Z' })
  createdAt: string;

  @ApiProperty({ example: '2024-12-29T23:36:19.080Z' })
  updatedAt: string;

  @ApiProperty({ example: 0 })
  __v: number;
}

export class ConversionSuccessResponse {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ type: ConversionTransaction })
  transaction: ConversionTransaction;
}

export enum ErrorTypeConversionApiEnum {
  UNSUPPORTED_CODE = "unsupported-code",
  MALFORMED_REQUEST = "malformed-request",
  INVALID_KEY = "invalid-key",
  INACTIVE_ACCOUNT = "inactive-account",
  QUOTA_REACHED = "quota-reached"
}

export class ErrorResponse {
  @ApiProperty({ example: false })
  success: boolean;

  // add enum for error types
  @ApiProperty({ enum: ErrorTypeConversionApiEnum })
  errorType: ErrorTypeConversionApiEnum;
}