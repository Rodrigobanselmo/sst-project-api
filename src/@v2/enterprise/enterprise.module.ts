import { Module } from '@nestjs/common';
import { SharedModule } from '../shared/shared.module';
import { CompanyModule } from './company/company.module';
import { HierarchyModule } from './hierarchy/hierarchy.module';
import { DocumentControlModule } from './document-control/document-control.module';

@Module({
  imports: [SharedModule, CompanyModule, HierarchyModule, DocumentControlModule],
  exports: [],
})
export class EnterpriseModule {}
