import { Injectable, Logger } from '@nestjs/common';
import { connect, Channel, Connection, ConsumeMessage } from 'amqplib';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RabbitMQService {
  private channel: Channel;
  private connection: Connection;
  private readonly logger = new Logger(RabbitMQService.name);
  private replyHandlers = new Map<string, (message: any) => void>(); // Map to track reply handlers

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    const rabbitMQUrl = this.configService.get<string>('RABBITMQ_URL');
    const username = this.configService.get<string>('RABBITMQ_USERNAME');
    const password = this.configService.get<string>('RABBITMQ_PASSWORD');

    const connectionUrl = rabbitMQUrl.replace('amqps://', `amqps://${username}:${password}@`);
    this.connection = await connect(connectionUrl);
    this.channel = await this.connection.createChannel();

    this.logger.log('Successfully connected to RabbitMQ broker.');
  }
  getChannel(): Channel {
    if (!this.channel) {
      throw new Error('RabbitMQ channel is not initialized yet');
    }
    return this.channel;
  }

  async publishWithReply(queue: string, message: any, replyQueue: string, correlationId: string) {
    await this.channel.assertQueue(queue);
    this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
      replyTo: replyQueue,
      correlationId,
    });
    this.logger.log(`Message published to queue: ${queue} with correlationId: ${correlationId}`);
  }
  
  async createReplyQueue(): Promise<string> {
    const { queue } = await this.channel.assertQueue('', { exclusive: true });
  
    // Start consuming messages from the temporary reply queue
    this.channel.consume(queue, async (msg) => {
      if (msg && msg.properties.correlationId) {
        const handler = this.replyHandlers.get(msg.properties.correlationId);
  
        if (handler) {
          this.logger.log(`Reply received for correlationId: ${msg.properties.correlationId}`);
          
          // Pass the message to the registered handler
          handler(JSON.parse(msg.content.toString()));
          
          // Remove the handler from the map
          this.replyHandlers.delete(msg.properties.correlationId);
  
          // Explicitly delete the temporary queue after processing the message
          await this.channel.deleteQueue(queue);
          this.logger.log(`Temporary reply queue deleted: ${queue}`);
        } else {
          this.logger.warn(`No handler found for correlationId: ${msg.properties.correlationId}`);
        }
      }
    });
  
    this.logger.log(`Reply queue created: ${queue}`);
    return queue;
  }
  

  registerReplyHandler(correlationId: string, callback: (message: any) => void) {
    this.replyHandlers.set(correlationId, callback);
  }
  unregisterReplyHandler(correlationId: string) {
    if (this.replyHandlers.has(correlationId)) {
      this.replyHandlers.delete(correlationId);
      this.logger.log(`Reply handler unregistered for correlationId: ${correlationId}`);
    }
  }
  /**
   * Explicitly exposes the `consume` method for generic message consumption.
   */
  async consume(queue: string, callback: (message: any, properties: any) => void) {
    await this.channel.assertQueue(queue);
    this.channel.consume(queue, (msg: ConsumeMessage | null) => {
      if (msg) {
        const content = JSON.parse(msg.content.toString());
        callback(content, msg.properties); 
        this.channel.ack(msg);
      }
    });
    this.logger.log(`Started consuming messages from queue: ${queue}`);
  }
}
