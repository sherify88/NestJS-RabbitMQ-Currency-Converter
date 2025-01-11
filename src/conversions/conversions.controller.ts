import { Controller, Post, Body } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { ConversionsService } from './conversions.service';
import { CreateConversionDto } from './dto/create-conversion.dto';
import { ITokenPayload } from 'src/utils/interfaces';
import { User } from 'src/utils/user.decorator';
import { ConversionSuccessResponse, ErrorResponse } from './response-schemas/response-schema';

@ApiTags('Conversions')
@ApiBearerAuth()
@Controller('conversions')
export class ConversionsController {
  constructor(private readonly conversionsService: ConversionsService) {}

  @Post('convert')
  @ApiOperation({ summary: 'Convert currency', description: 'Converts the amount from source to target currency.' })
  @ApiResponse({ status: 200, type: ConversionSuccessResponse })
  @ApiResponse({ status: 400, type: ErrorResponse })
  create(@User() { id }: ITokenPayload, @Body() dto: CreateConversionDto) {
    dto.userId = id;
    return this.conversionsService.requestConversion(dto);
  }
}
