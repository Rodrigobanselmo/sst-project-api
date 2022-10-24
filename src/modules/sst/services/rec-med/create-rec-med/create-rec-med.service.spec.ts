import { Test, TestingModule } from '@nestjs/testing';
import { CreateRecMedService } from './create-rec-med.service';

describe.skip('CreateRecMedService', () => {
  let service: CreateRecMedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateRecMedService],
    }).compile();

    service = module.get<CreateRecMedService>(CreateRecMedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
