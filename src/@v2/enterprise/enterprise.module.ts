import { Module } from '@nestjs/common';
import { SharedModule } from '../shared/shared.module';
import { CompanyModule } from './company/company.module';

@Module({
  imports: [SharedModule, CompanyModule],
  exports: []
})
export class EnterpriseModule { }
