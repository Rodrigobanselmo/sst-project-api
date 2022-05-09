import { Test, TestingModule } from '@nestjs/testing';
import { UpsertRiskDataService } from './upsert-risk.service';

describe.skip('UpsertRiskDataService', () => {
  let service: UpsertRiskDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UpsertRiskDataService],
    }).compile();

    service = module.get<UpsertRiskDataService>(UpsertRiskDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
