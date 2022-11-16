import { Test, TestingModule } from '@nestjs/testing';
import { DownloadUniqueCompanyService } from './download-unique-company.service';

describe.skip('DownloadUniqueCompanyService', () => {
  let service: DownloadUniqueCompanyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DownloadUniqueCompanyService],
    }).compile();

    service = module.get<DownloadUniqueCompanyService>(DownloadUniqueCompanyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
