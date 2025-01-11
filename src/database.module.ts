import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('DB_URI'), // MongoDB connection string
        connectionFactory: (connection) => {
          console.log('Connected to MongoDB');
          return connection;
        },
      }),
    }),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
