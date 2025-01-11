import { Module } from '@nestjs/common';
import { ConversionsService } from './conversions.service';
import { ConversionsController } from './conversions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConvTransactionSchema } from './entities/conversion.entity';
import { HttpModule } from '@nestjs/axios';
import { UsersModule } from 'src/users/users.module';
import { QueueModule } from 'src/queue-service/queue.module';
import { ConversionProcessorService } from './conversion-process.service';
import { ConversionConsumerService } from './conversion-consumer.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'ConvTransaction', schema: ConvTransactionSchema }]),
    HttpModule, UsersModule, QueueModule
  ],
  controllers: [ConversionsController],
  providers: [
    ConversionsService,
    ConversionProcessorService,
    ConversionConsumerService, 
  ],
  exports: [
    ConversionProcessorService,
    ConversionConsumerService, 
  ],
})
export class ConversionsModule { }
