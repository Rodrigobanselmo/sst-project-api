import { Test, TestingModule } from '@nestjs/testing';
import { UploadEpiDataService } from './upload-epi-data.service';

describe.skip('UploadEpiDataService', () => {
  let service: UploadEpiDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UploadEpiDataService],
    }).compile();

    service = module.get<UploadEpiDataService>(UploadEpiDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
