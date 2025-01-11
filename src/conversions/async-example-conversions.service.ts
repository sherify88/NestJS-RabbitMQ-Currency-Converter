// import { Injectable, OnModuleInit, BadRequestException, NotFoundException } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { ConfigService } from '@nestjs/config';
// import { HttpService } from '@nestjs/axios';
// import { CreateConversionDto } from './dto/create-conversion.dto';
// import { ConvTransaction } from './entities/conversion.entity';
// import { ICreateTransaction } from './create-transaction-interfaces';
// import { UsersService } from 'src/users/users.service';
// import { RabbitMQService } from 'src/queue-service/rabbitmq-service.service';
// import { RabbitMQServiceAsync } from 'src/queue-service/rabbitmq-service-async.service';
// const { v4: uuidv4 } = require('uuid');

// @Injectable()
// export class ConversionsServiceAsync implements OnModuleInit {
//   private currencyConversionUri: string;
//   private currencyConversionApiKey: string;
//   private conversionQueueName: string;

//   constructor(
//     @InjectModel('ConvTransaction') private readonly convTransactionsModel: Model<ConvTransaction>,
//     private readonly configService: ConfigService,
//     private readonly httpService: HttpService,
//     private readonly usersService: UsersService,
//     private readonly rabbitMQService: RabbitMQServiceAsync, // Inject RabbitMQ service
//   ) {
//     this.currencyConversionUri = this.configService.get<string>('CURRENCY_CONVERSION_URI');
//     this.currencyConversionApiKey = this.configService.get<string>('CURRENCY_CONVERSION_API_KEY');
//     this.conversionQueueName = this.configService.get<string>('CONVERSION_QUEUE_NAME');
//   }

//   onModuleInit() {
//     this.rabbitMQService.consume(this.conversionQueueName, this.processConversionRequest.bind(this));
//   }

//   async enqueueConversion(dto: CreateConversionDto) {
//     dto.requestId = uuidv4();
//     console.log(`Received conversion request: ${JSON.stringify(dto)}`);
//     await this.rabbitMQService.publish(this.conversionQueueName, dto);
//     console.log(`Published conversion request to queue: ${dto.requestId}`);
//     return { message: 'Request received and being processed' };
//   }

//   private async processConversionRequest(dto: CreateConversionDto) {
//     try {
//       // Check for existing transaction
//       const existingTransaction = await this.convTransactionsModel.findOne({ requestId: dto.requestId });
//       if (existingTransaction) {
//         console.log(`Duplicate request detected: ${dto.requestId}`);
//         return; // Skip processing
//       }

//       // Proceed with processing
//       const response = await this.convertCurrencyApi(dto);
//       const createTransactionDto: ICreateTransaction = {
//         ...dto,
//         convertedAmount: response.conversion_result,
//       };

//       await this.createTransaction(createTransactionDto);
//       console.log(`Transaction for user ${dto.userId} completed.`);
//     } catch (error) {
//       console.error(`Failed to process conversion request: ${error.message}`);
//       throw error; // Re-throw error for retry mechanism
//     }
//   }

//   private async convertCurrencyApi(dto: CreateConversionDto) {
//     const { sourceCurrency, targetCurrency, amount } = dto;
//     const url = `${this.currencyConversionUri}/${this.currencyConversionApiKey}/pair/${sourceCurrency}/${targetCurrency}/${amount}`;

//     try {
//       const response = await this.httpService.axiosRef.get(url);
//       return response.data;
//     } catch (error) {
//       if (error.response) {
//         throw new BadRequestException({
//           status: error.response.status,
//           message: error.response.statusText,
//           error: error.response.data,
//         });
//       } else {
//         throw new NotFoundException('An unknown error occurred while fetching conversion rate');
//       }
//     }
//   }

//   private async createTransaction(dto: ICreateTransaction) {
//     const { sourceCurrency, targetCurrency, amount, convertedAmount, userId, requestId } = dto;
//     const user = await this.usersService.findOne(userId);

//     if (!user) {
//       throw new NotFoundException('User not found');
//     }

//     const transaction = new this.convTransactionsModel({
//       sourceCurrency,
//       targetCurrency,
//       amount,
//       convertedAmount,
//       user: user._id,
//       requestId, // Include the request ID
//     });

//     await transaction.save();
//     return transaction;
//   }
// }
