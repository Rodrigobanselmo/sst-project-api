import { Test, TestingModule } from '@nestjs/testing';
import { UpsertRiskGroupDataService } from './upsert-risk-group-data.service';

describe.skip('UpsertRiskGroupDataService', () => {
  let service: UpsertRiskGroupDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UpsertRiskGroupDataService],
    }).compile();

    service = module.get<UpsertRiskGroupDataService>(UpsertRiskGroupDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
