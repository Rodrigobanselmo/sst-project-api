import { Test, TestingModule } from '@nestjs/testing';
import { UpdateEpiService } from './update-epi.service';

describe.skip('UpdateEpiService', () => {
  let service: UpdateEpiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UpdateEpiService],
    }).compile();

    service = module.get<UpdateEpiService>(UpdateEpiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
