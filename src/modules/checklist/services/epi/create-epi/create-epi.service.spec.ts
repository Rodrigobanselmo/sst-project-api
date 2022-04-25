import { Test, TestingModule } from '@nestjs/testing';
import { CreateEpiService } from './create-epi.service';

describe.skip('CreateEpiService', () => {
  let service: CreateEpiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateEpiService],
    }).compile();

    service = module.get<CreateEpiService>(CreateEpiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
