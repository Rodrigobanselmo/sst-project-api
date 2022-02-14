import { Test, TestingModule } from '@nestjs/testing';
import { FindAvailableChecklistService } from './find-available-checklist.service';

describe('FindAvailableChecklistService', () => {
  let service: FindAvailableChecklistService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FindAvailableChecklistService],
    }).compile();

    service = module.get<FindAvailableChecklistService>(
      FindAvailableChecklistService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
