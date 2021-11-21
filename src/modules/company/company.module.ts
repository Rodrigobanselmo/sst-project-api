import { Module } from '@nestjs/common';
import { CreateCompanyService } from './services/create-company/create-company.service';
import { CompanyController } from './controller/company.controller';
import { UpdateCompanyService } from './services/update-company/update-company.service';
import { CompanyRepository } from './repositories/implementations/CompanyRepository';
import { CreateContractService } from './services/create-contract/create-contract.service';
import { LicenseRepository } from './repositories/implementations/LicenseRepository';

@Module({
  controllers: [CompanyController],
  providers: [
    CreateCompanyService,
    UpdateCompanyService,
    CreateContractService,
    CompanyRepository,
    LicenseRepository,
  ],
})
export class CompanyModule {}
