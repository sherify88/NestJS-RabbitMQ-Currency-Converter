import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RabbitMQService } from './rabbitmq-service.service';

@Module({
  providers: [RabbitMQService],
  exports: [RabbitMQService], 
})
export class QueueModule {}
