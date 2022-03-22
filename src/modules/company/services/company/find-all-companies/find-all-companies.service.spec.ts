import { Test, TestingModule } from '@nestjs/testing';
import { FindAllCompaniesService } from './find-all-companies.service';

describe('FindAllCompaniesService', () => {
  let service: FindAllCompaniesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FindAllCompaniesService],
    }).compile();

    service = module.get<FindAllCompaniesService>(FindAllCompaniesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
