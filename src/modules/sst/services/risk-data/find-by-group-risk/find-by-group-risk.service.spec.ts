import { Test, TestingModule } from '@nestjs/testing';
import { FindAllByGroupAndRiskService } from './find-by-group-risk.service';

describe.skip('FindAllByGroupAndRisk', () => {
  let service: FindAllByGroupAndRiskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FindAllByGroupAndRiskService],
    }).compile();

    service = module.get<FindAllByGroupAndRiskService>(FindAllByGroupAndRiskService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
