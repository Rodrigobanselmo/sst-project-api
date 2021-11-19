import { Module } from '@nestjs/common';
import { CreateCompanyService } from './services/create-company/create-company.service';
import { CompanyController } from './controller/company.controller';
import { UpdateCompanyService } from './services/update-company/update-company.service';
import { CompanyRepository } from './repositories/implementations/CompanyRepository';

@Module({
  controllers: [CompanyController],
  providers: [CreateCompanyService, UpdateCompanyService, CompanyRepository],
})
export class CompanyModule {}
