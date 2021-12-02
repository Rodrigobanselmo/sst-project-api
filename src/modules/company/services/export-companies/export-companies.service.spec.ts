import { Test, TestingModule } from '@nestjs/testing';
import { ExportCompaniesService } from './export-companies.service';

describe('ExportCompaniesService', () => {
  let service: ExportCompaniesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExportCompaniesService],
    }).compile();

    service = module.get<ExportCompaniesService>(ExportCompaniesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
