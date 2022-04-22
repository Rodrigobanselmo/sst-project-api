import { Test, TestingModule } from '@nestjs/testing';
import { FindMeService } from './find-me.service';

describe.skip('FindMeService', () => {
  let service: FindMeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FindMeService],
    }).compile();

    service = module.get<FindMeService>(FindMeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
