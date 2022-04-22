import { Test, TestingModule } from '@nestjs/testing';
import { UpdateRiskService } from './update-risk.service';

describe.skip('UpdateRiskService', () => {
  let service: UpdateRiskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UpdateRiskService],
    }).compile();

    service = module.get<UpdateRiskService>(UpdateRiskService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
