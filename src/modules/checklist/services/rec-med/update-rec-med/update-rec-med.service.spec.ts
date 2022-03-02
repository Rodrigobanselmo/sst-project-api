import { Test, TestingModule } from '@nestjs/testing';
import { UpdateRecMedService } from './update-rec-med.service';

describe('UpdateRecMedService', () => {
  let service: UpdateRecMedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UpdateRecMedService],
    }).compile();

    service = module.get<UpdateRecMedService>(UpdateRecMedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
