import { Test, TestingModule } from '@nestjs/testing';
import { FindCAEpiService } from './find-ca-epi.service';

describe.skip('FindCAEpiService', () => {
  let service: FindCAEpiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FindCAEpiService],
    }).compile();

    service = module.get<FindCAEpiService>(FindCAEpiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
