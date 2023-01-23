import { Test, TestingModule } from '@nestjs/testing';
import { SendingPricesService } from './sending-prices.service';

describe('SendingPricesService', () => {
  let service: SendingPricesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SendingPricesService],
    }).compile();

    service = module.get<SendingPricesService>(SendingPricesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
