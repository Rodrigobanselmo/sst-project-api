import { Module } from '@nestjs/common';

import { ExcelProvider } from '../../shared/providers/ExcelProvider/implementations/ExcelProvider';
import { CompanyController } from './controller/manager/company.controller';
import { CompanyRepository } from './repositories/implementations/CompanyRepository';
import { LicenseRepository } from './repositories/implementations/LicenseRepository';
import { CreateCompanyService } from './services/manager/create-company/create-company.service';
import { CreateContractService } from './services/manager/create-contract/create-contract.service';
import { UpdateCompanyService } from './services/manager/update-company/update-company.service';
import { FindAllCompaniesService } from './services/manager/find-all-companies/find-all-companies.service';

@Module({
  controllers: [CompanyController],
  providers: [
    CreateCompanyService,
    UpdateCompanyService,
    CreateContractService,
    CompanyRepository,
    LicenseRepository,
    ExcelProvider,
    FindAllCompaniesService,
  ],
  exports: [CompanyRepository],
})
export class CompanyModule {}
