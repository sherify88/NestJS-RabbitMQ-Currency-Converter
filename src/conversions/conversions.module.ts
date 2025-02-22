import { Module } from '@nestjs/common';
import { ConversionsService } from './conversions.service';
import { ConversionsController } from './conversions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConvTransactionSchema } from './entities/conversion.entity';
import { HttpModule } from '@nestjs/axios';
import { UsersModule } from 'src/users/users.module';
import { ConversionProcessorService } from './conversion-process.service';
import { ConversionConsumerService } from './conversion-consumer.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'ConvTransaction', schema: ConvTransactionSchema }]),
    HttpModule,
    UsersModule,
    ClientsModule.registerAsync([
      {
        name: 'RABBITMQ_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URL')],
            queue: configService.get<string>('CONVERSION_QUEUE_NAME'),
            queueOptions: {
              durable: true,
            },
          },
        }),
      },
    ]),
  ],
  controllers: [ConversionsController, ConversionConsumerService], 
  providers: [
    ConversionsService,
    ConversionProcessorService,
  ],
  exports: [
    ConversionProcessorService,
  ],
})
export class ConversionsModule {}
