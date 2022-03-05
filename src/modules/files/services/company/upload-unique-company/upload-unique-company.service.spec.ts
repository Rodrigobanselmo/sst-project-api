import { Test, TestingModule } from '@nestjs/testing';
import { UploadUniqueCompanyService } from './upload-unique-company.service';

describe('UploadUniqueCompanyService', () => {
  let service: UploadUniqueCompanyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UploadUniqueCompanyService],
    }).compile();

    service = module.get<UploadUniqueCompanyService>(UploadUniqueCompanyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
