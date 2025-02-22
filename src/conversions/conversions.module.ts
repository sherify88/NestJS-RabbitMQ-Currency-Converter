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
import { createRabbitMQClient } from 'src/utils/rabbitmq-client.factory';



@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'ConvTransaction', schema: ConvTransactionSchema }]),
    HttpModule,
    UsersModule,
    ClientsModule.registerAsync([
      {
        name: 'RABBITMQ_SERVICE',
        ...createRabbitMQClient('CONVERSION_QUEUE_NAME'),
      },
      {
        name: 'EMAIL_SERVICE',
        ...createRabbitMQClient('email_queue'),
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
