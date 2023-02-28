import { Test, TestingModule } from '@nestjs/testing';
import { UpdateCompanyService } from './update-company.service';

describe.skip('UpdateCompanyService', () => {
  let service: UpdateCompanyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UpdateCompanyService],
    }).compile();

    service = module.get<UpdateCompanyService>(UpdateCompanyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
