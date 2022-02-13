import { Module } from '@nestjs/common';

import { ExcelProvider } from '../../shared/providers/ExcelProvider/implementations/ExcelProvider';
import { CompanyController } from './controller/manager/company.controller';
import { CompanyRepository } from './repositories/implementations/CompanyRepository';
import { LicenseRepository } from './repositories/implementations/LicenseRepository';
import { CreateCompanyService } from './services/manager/create-company/create-company.service';
import { CreateContractService } from './services/manager/create-contract/create-contract.service';
import { ExportCompaniesService } from './services/manager/export-companies/export-companies.service';
import { UpdateCompanyService } from './services/manager/update-company/update-company.service';

@Module({
  controllers: [CompanyController],
  providers: [
    CreateCompanyService,
    UpdateCompanyService,
    CreateContractService,
    CompanyRepository,
    LicenseRepository,
    ExportCompaniesService,
    ExcelProvider,
  ],
})
export class CompanyModule {}
