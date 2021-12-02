import { Module } from '@nestjs/common';
import { CreateCompanyService } from './services/create-company/create-company.service';
import { CompanyController } from './controller/company.controller';
import { UpdateCompanyService } from './services/update-company/update-company.service';
import { CompanyRepository } from './repositories/implementations/CompanyRepository';
import { CreateContractService } from './services/create-contract/create-contract.service';
import { LicenseRepository } from './repositories/implementations/LicenseRepository';
import { ExportCompaniesService } from './services/export-companies/export-companies.service';
import { ExcelProvider } from '../../shared/providers/ExcelProvider/implementations/ExcelProvider';

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
