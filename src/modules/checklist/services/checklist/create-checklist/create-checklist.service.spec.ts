import { Test, TestingModule } from '@nestjs/testing';
import { CreateChecklistService } from './create-checklist.service';

describe('CreateChecklistService', () => {
  let service: CreateChecklistService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateChecklistService],
    }).compile();

    service = module.get<CreateChecklistService>(CreateChecklistService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
