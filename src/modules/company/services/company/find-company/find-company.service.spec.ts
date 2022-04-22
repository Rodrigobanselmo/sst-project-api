import { Test, TestingModule } from '@nestjs/testing';
import { FindCompanyService } from './find-company.service';

describe.skip('FindCompanyService', () => {
  let service: FindCompanyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FindCompanyService],
    }).compile();

    service = module.get<FindCompanyService>(FindCompanyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
