import { Test, TestingModule } from '@nestjs/testing';
import { DownloadRiskDataService } from './download-risk-data.service';

describe.skip('DownloadRiskDataService', () => {
  let service: DownloadRiskDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DownloadRiskDataService],
    }).compile();

    service = module.get<DownloadRiskDataService>(DownloadRiskDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
