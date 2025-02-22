import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ConvTransaction } from './entities/conversion.entity';
import { ICreateTransaction } from './create-transaction-interfaces';
import { UsersService } from 'src/users/users.service';
import { ErrorResponseConversionApi } from './exchange-api-interfaces';

@Injectable()
export class ConversionProcessorService {
  private readonly logger = new Logger(ConversionProcessorService.name);
  private currencyConversionUri: string;
  private currencyConversionApiKey: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly usersService: UsersService,
    @InjectModel('ConvTransaction') private readonly convTransactionsModel: Model<ConvTransaction>,
  ) {
    this.currencyConversionUri = process.env.CURRENCY_CONVERSION_URI;
    this.currencyConversionApiKey = process.env.CURRENCY_CONVERSION_API_KEY;
  }

  /**
   * Main method to process conversion requests.
   */
  async processConversion(dto: ICreateTransaction): Promise<any> {
    try {
      console.log(`Processing conversion for requestId: ${dto.requestId}`);

      // Step 1: Check for existing transaction
      const existingTransaction = await this.convTransactionsModel.findOne({ requestId: dto.requestId });
      if (existingTransaction) {
        console.log(`Duplicate request detected for requestId11: ${dto.requestId}`);
        return { success: false, message: 'Duplicate request detected11', transaction: existingTransaction };
      }

      // Step 2: Fetch conversion rate
      const conversionResult = await this.convertCurrencyApi(dto.sourceCurrency, dto.targetCurrency, dto.amount);

      // Step 3: Save the transaction
      const savedTransaction = await this.createTransaction({
        ...dto,
        convertedAmount: conversionResult.convertedAmount,
      });

      this.logger.log(`Transaction processed successfully for requestId: ${dto.requestId}`);
      return { success: true, transaction: savedTransaction };
    } catch (error) {
      this.logger.error(`Error processing conversion for requestId: ${dto.requestId} - ${error.message}`);
      const errorRes = error as ErrorResponseConversionApi;
      return { success: false, message: errorRes['error-type']};
    }
  }

  /**
   * Calls the external API to fetch conversion rates.
   */
  async convertCurrencyApi(sourceCurrency: string, targetCurrency: string, amount: number) {
    const url = `${this.currencyConversionUri}/${this.currencyConversionApiKey}/pair/${sourceCurrency}/${targetCurrency}/${amount}`;

    try {
      const response = await this.httpService.axiosRef.get(url);
      return { convertedAmount: response.data.conversion_result };
    } catch (error) {
      if (error.response) {
        console.log({ApiError: error.response.data, status: error.response.status,});
        throw error.response.data;
      }
      this.logger.error('Unknown error occurred during API call');
      throw new NotFoundException('Currency conversion failed');
    }
  }

  /**
   * Creates a transaction and stores it in the database.
   */
  async createTransaction(dto: ICreateTransaction) {
    const { userId, requestId } = dto;

    // Check for duplicates
    const existingTransaction = await this.convTransactionsModel.findOne({ requestId });
    if (existingTransaction) {
      this.logger.warn(`Duplicate transaction detected for requestId: ${requestId}`);
      return existingTransaction;
    }

    // Validate user
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
 // Save transaction
 const transaction = new this.convTransactionsModel({ 
  ...dto, 
  user: user._id,
});
const savedTransaction = await transaction.save();
return savedTransaction;
    
  }
}
