import { Test, TestingModule } from '@nestjs/testing';
import { CreateRiskService } from './create-risk.service';

describe('CreateRiskService', () => {
  let service: CreateRiskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateRiskService],
    }).compile();

    service = module.get<CreateRiskService>(CreateRiskService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
