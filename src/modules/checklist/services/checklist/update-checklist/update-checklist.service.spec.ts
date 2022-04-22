import { Test, TestingModule } from '@nestjs/testing';
import { UpdateChecklistService } from './update-checklist.service';

describe.skip('UpdateChecklistService', () => {
  let service: UpdateChecklistService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UpdateChecklistService],
    }).compile();

    service = module.get<UpdateChecklistService>(UpdateChecklistService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
