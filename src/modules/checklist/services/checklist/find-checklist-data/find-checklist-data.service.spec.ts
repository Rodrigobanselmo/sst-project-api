import { Test, TestingModule } from '@nestjs/testing';
import { FindChecklistDataService } from './find-checklist-data.service';

describe('FindChecklistDataService', () => {
  let service: FindChecklistDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FindChecklistDataService],
    }).compile();

    service = module.get<FindChecklistDataService>(FindChecklistDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
