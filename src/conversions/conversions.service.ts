import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { RabbitMQService } from 'src/queue-service/rabbitmq-service.service';
import { CreateConversionDto } from './dto/create-conversion.dto';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ConversionsService {
  private readonly conversionQueueName: string;
  private readonly logger = new Logger(ConversionsService.name);

  constructor(
    private readonly rabbitMQService: RabbitMQService,
        private readonly configService: ConfigService,
    
  ) {
    this.conversionQueueName = this.configService.get<string>('CONVERSION_QUEUE_NAME');
  }


async requestConversion(dto: CreateConversionDto): Promise<any> {
  const correlationId = uuidv4();
  const requestId = uuidv4();
  dto.requestId = requestId;

  const replyQueue = await this.rabbitMQService.createReplyQueue();

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      this.rabbitMQService.unregisterReplyHandler(correlationId); // Cleanup handler
      reject(new Error('Timeout waiting for response'));
    }, 8000); // Set the timeout duration

    this.rabbitMQService.registerReplyHandler(correlationId, (message: any) => {
      clearTimeout(timeout);

      if(message.data.success){
        resolve(message.data);
      }
        reject(new BadRequestException(message.data.message));
      
    });

    this.rabbitMQService.publishWithReply(
      this.conversionQueueName,
      dto,
      replyQueue,
      correlationId,
    ).catch((error) => {
      clearTimeout(timeout);
      console.error(`Error publishing message: ${error.message}`);
      reject(error);
    });

    console.log(`Request sent with correlationId: ${correlationId}`);
  });
}

  
}
