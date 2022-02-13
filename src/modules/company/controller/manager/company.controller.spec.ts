import { Test, TestingModule } from '@nestjs/testing';
import { CompanyController } from './company.controller';
import { CreateCompanyService } from '../../services/manager/create-company/create-company.service';

describe('CompanyController', () => {
  let controller: CompanyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyController],
      providers: [CreateCompanyService],
    }).compile();

    controller = module.get<CompanyController>(CompanyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
