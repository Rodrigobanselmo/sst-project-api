import { Test, TestingModule } from '@nestjs/testing';
import { FindAllByCompanyService } from './find-by-company.service';

describe.skip('FindAllByGroupAndRisk', () => {
  let service: FindAllByCompanyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FindAllByCompanyService],
    }).compile();

    service = module.get<FindAllByCompanyService>(FindAllByCompanyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
