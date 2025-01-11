// import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
// import { connect, Channel, Connection } from 'amqplib';
// import { ConfigService } from '@nestjs/config';

// @Injectable()
// export class RabbitMQServiceAsync implements OnModuleInit {
//   private channel: Channel;
//   private connection: Connection;
//   private readonly logger = new Logger(RabbitMQServiceAsync.name); // Add a logger instance

//   constructor(private readonly configService: ConfigService) {}

//   async onModuleInit() {
//     try {
//       const rabbitMQUrl = this.configService.get<string>('RABBITMQ_URL');
//       const username = this.configService.get<string>('RABBITMQ_USERNAME');
//       const password = this.configService.get<string>('RABBITMQ_PASSWORD');

//       // Construct the connection URL with credentials
//       const connectionUrl = rabbitMQUrl.replace(
//         'amqps://',
//         `amqps://${username}:${password}@`
//       );

//       // Establish the connection
//       this.connection = await connect(connectionUrl);
//       this.channel = await this.connection.createChannel();

//       // Log successful connection
//       this.logger.log('Successfully connected to RabbitMQ broker.');
//     } catch (error) {
//       this.logger.error('Failed to connect to RabbitMQ broker.', error.message);
//       throw error; // Rethrow to ensure the app doesn't continue in a broken state
//     }
//   }

//   async publish(queue: string, message: any) {
//     try {
//       await this.channel.assertQueue(queue);
//       this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
//       this.logger.log(`Message published to queue: ${queue}`);
//     } catch (error) {
//       this.logger.error(`Failed to publish message to queue: ${queue}`, error.message);
//       throw error;
//     }
//   }

//   async consume(queue: string, callback: (message: any) => void) {
//     try {
//       await this.channel.assertQueue(queue);
//       this.channel.consume(queue, (message) => {
//         if (message) {
//           const content = JSON.parse(message.content.toString());
//           this.logger.log(`Message consumed from queue: ${queue}`);
//           callback(content);
//           this.channel.ack(message);
//         }
//       });
//     } catch (error) {
//       this.logger.error(`Failed to consume messages from queue: ${queue}`, error.message);
//       throw error;
//     }
//   }

//   async closeConnection() {
//     try {
//       await this.channel.close();
//       await this.connection.close();
//       this.logger.log('RabbitMQ connection closed successfully.');
//     } catch (error) {
//       this.logger.error('Failed to close RabbitMQ connection.', error.message);
//     }
//   }
// }
