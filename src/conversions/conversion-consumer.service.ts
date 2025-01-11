import { Injectable, Logger } from '@nestjs/common';
import { RabbitMQService } from 'src/queue-service/rabbitmq-service.service';
import { ConversionProcessorService } from './conversion-process.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ConversionConsumerService {
  private readonly logger = new Logger(ConversionConsumerService.name);
  private readonly conversionQueueName: string;

  constructor(
    private readonly rabbitMQService: RabbitMQService,
    private readonly processor: ConversionProcessorService,
            private readonly configService: ConfigService,
    
  ) {
    this.conversionQueueName = this.configService.get<string>('CONVERSION_QUEUE_NAME');

  }

  async onModuleInit() {
    this.rabbitMQService.consume(this.conversionQueueName, async (message, properties) => {
      try {
        this.logger.log(`Processing message with correlationId: ${properties.correlationId}`);
  
        const result = await this.processor.processConversion(message);
  
        this.rabbitMQService.getChannel().sendToQueue(
          properties.replyTo,
          Buffer.from(JSON.stringify({ success: true, data: result })),
          { correlationId: properties.correlationId },
        );
  
      } catch (error) {
        this.logger.error(`Failed to process message: ${error.message}`);
  
        if (properties?.replyTo && properties?.correlationId) {
          this.rabbitMQService.getChannel().sendToQueue(
            properties.replyTo,
            Buffer.from(JSON.stringify({ success: false, error: error.message })),
            { correlationId: properties.correlationId },
          );
  
          this.logger.log(`Error response sent for correlationId: ${properties.correlationId}`);
        }
        
      }
    });
  }
  
  
}
