import { Test, TestingModule } from '@nestjs/testing';
import { FindEpiService } from './find-epi.service';

describe.skip('FindEpiService', () => {
  let service: FindEpiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FindEpiService],
    }).compile();

    service = module.get<FindEpiService>(FindEpiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
