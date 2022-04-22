import { Test, TestingModule } from '@nestjs/testing';
import { CreateContractService } from './create-contract.service';

describe.skip('CreateContractService', () => {
  let service: CreateContractService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateContractService],
    }).compile();

    service = module.get<CreateContractService>(CreateContractService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
