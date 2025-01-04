import { Module } from '@nestjs/common';
import { SharedModule } from '../shared/shared.module';
import { CompanyModule } from './company/company.module';
import { HierarchyModule } from './hierarchy/hierarchy.module';

@Module({
  imports: [SharedModule, CompanyModule, HierarchyModule],
  exports: []
})
export class EnterpriseModule { }
