import { Test, TestingModule } from '@nestjs/testing';
import { FindAllAvailableRiskService } from './find-all-available-risk.service';

describe('FindAllAvailableRiskService', () => {
  let service: FindAllAvailableRiskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FindAllAvailableRiskService],
    }).compile();

    service = module.get<FindAllAvailableRiskService>(FindAllAvailableRiskService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
