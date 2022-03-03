import { Test, TestingModule } from '@nestjs/testing';
import { DownloadCompaniesService } from './download-companies.service';

describe('DownloadCompaniesService', () => {
  let service: DownloadCompaniesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DownloadCompaniesService],
    }).compile();

    service = module.get<DownloadCompaniesService>(DownloadCompaniesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
