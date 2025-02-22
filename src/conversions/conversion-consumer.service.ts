import { Controller, Logger, OnModuleInit } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ConversionProcessorService } from './conversion-process.service';

@Controller()
export class ConversionConsumerService implements OnModuleInit {
  private readonly logger = new Logger(ConversionConsumerService.name);

  constructor(private readonly processor: ConversionProcessorService) {}

  onModuleInit() {
    this.logger.log('✅ Consumer Service Connected to RabbitMQ');
  }

  @MessagePattern('conversion_request') 
  async handleConversion(@Payload() dto: any) {
    this.logger.log(`📥 Received conversion request:`, dto);
    return await this.processor.processConversion(dto);
  }
}
