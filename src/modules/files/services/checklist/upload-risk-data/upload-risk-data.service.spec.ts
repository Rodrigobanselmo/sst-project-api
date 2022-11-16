import { Test, TestingModule } from '@nestjs/testing';
import { UploadChecklistDataService } from './upload-risk-data.service';

describe.skip('UploadChecklistDataService', () => {
  let service: UploadChecklistDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UploadChecklistDataService],
    }).compile();

    service = module.get<UploadChecklistDataService>(UploadChecklistDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
