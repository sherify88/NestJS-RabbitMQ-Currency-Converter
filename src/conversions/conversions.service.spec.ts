import { Test, TestingModule } from '@nestjs/testing';
import { ConversionsService } from './conversions.service';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { CreateConversionDto } from './dto/create-conversion.dto';
import { firstValueFrom, of } from 'rxjs';

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mocked-correlation-id'),
}));

describe('ConversionsService', () => {
  let service: ConversionsService;
  let rabbitClient: Partial<jest.Mocked<ClientProxy>>;

  beforeEach(async () => {
    rabbitClient = {
      send: jest.fn().mockReturnValue(of({ success: true, convertedAmount: 85 })),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConversionsService,
        { provide: 'RABBITMQ_SERVICE', useValue: rabbitClient },
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

    expect(rabbitClient.send).toHaveBeenCalledWith('conversion_request', expect.objectContaining({
      sourceCurrency: 'USD',
      targetCurrency: 'EUR',
      amount: 100,
      userId: 'user123',
      requestId: expect.any(String),
    }));
  });
});
