import { Test, TestingModule } from '@nestjs/testing';
import { UploadCompaniesService } from './upload-companies.service';

describe.skip('UploadCompaniesService', () => {
  let service: UploadCompaniesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UploadCompaniesService],
    }).compile();

    service = module.get<UploadCompaniesService>(UploadCompaniesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
