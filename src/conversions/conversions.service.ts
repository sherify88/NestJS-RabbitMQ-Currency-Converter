import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateConversionDto } from './dto/create-conversion.dto';
import { firstValueFrom } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ConversionsService {
  constructor(@Inject('RABBITMQ_SERVICE') private readonly rabbitClient: ClientProxy) {}

  async requestConversion(dto: CreateConversionDto): Promise<any> {
    try {
      const requestId = uuidv4();
      dto.requestId = requestId;
      console.log(`🚀 Sending conversion request:`, dto);
      
      if (!this.rabbitClient) {
        throw new Error('RabbitMQ ClientProxy is not initialized!');
      }
  
      const result = await firstValueFrom(
        this.rabbitClient.send('conversion_request', dto) 
      );
  
      console.log(`✅ Received Response:`, result);
      return result;
    } catch (error) {
      console.error(`❌ RabbitMQ Error:`, error);
      throw new Error('Failed to send message to RabbitMQ.');
    }
  }
  
}
