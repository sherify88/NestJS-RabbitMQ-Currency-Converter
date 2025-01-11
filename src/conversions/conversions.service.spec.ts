import { Test, TestingModule } from '@nestjs/testing';
import { ConversionsService } from './conversions.service';
import { RabbitMQService } from 'src/queue-service/rabbitmq-service.service';
import { ConfigService } from '@nestjs/config';
import { CreateConversionDto } from './dto/create-conversion.dto';
import { BadRequestException } from '@nestjs/common';

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mocked-correlation-id'),
}));

describe('ConversionsService', () => {
  let service: ConversionsService;
  let rabbitMQService: Partial<Record<keyof RabbitMQService, jest.Mock>>;

  beforeEach(async () => {
    rabbitMQService = {
      createReplyQueue: jest.fn().mockResolvedValue('mockReplyQueue'),
      registerReplyHandler: jest.fn((correlationId, callback) => {
        setTimeout(() => {
          callback({ data: { success: true, convertedAmount: 85 } }); 
        }, 100); 
      }),
      unregisterReplyHandler: jest.fn(),
      publishWithReply: jest.fn().mockResolvedValue(undefined), 
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConversionsService,
        { provide: RabbitMQService, useValue: rabbitMQService },
        { provide: ConfigService, useValue: { get: jest.fn(() => 'mockConversionQueue') } },
      ],
    }).compile();

    service = module.get<ConversionsService>(ConversionsService);
  });

  it('should handle conversion request and return the result', async () => {
    const mockDto: CreateConversionDto = {
      sourceCurrency: 'USD',
      targetCurrency: 'EUR',
      amount: 100,
      userId: 'user123',
      requestId: '', // Will be filled by the service
    };

    const result = await service.requestConversion(mockDto);
    

    // Assertions
    expect(result).toEqual({
      success: true,
      convertedAmount: 85,
    });

    expect(rabbitMQService.createReplyQueue).toHaveBeenCalled();
    expect(rabbitMQService.registerReplyHandler).toHaveBeenCalledWith(
      'mocked-correlation-id',
      expect.any(Function),
    );
    expect(rabbitMQService.publishWithReply).toHaveBeenCalledWith(
      'mockConversionQueue',
      expect.objectContaining({
        sourceCurrency: 'USD',
        targetCurrency: 'EUR',
        amount: 100,
        userId: 'user123',
        requestId: expect.any(String),
      }),
      'mockReplyQueue',
      'mocked-correlation-id',
    );
  });
});
