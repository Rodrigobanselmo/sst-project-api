import { Module } from '@nestjs/common';
import { SharedModule } from '../shared/shared.module';
import { AbsenteeismModule } from './absenteeism/absenteeism.module';
import { CompanyModule } from './company/company.module';
import { DocumentControlModule } from './document-control/document-control.module';
import { HierarchyModule } from './hierarchy/hierarchy.module';

@Module({
  imports: [SharedModule, CompanyModule, HierarchyModule, DocumentControlModule, AbsenteeismModule],
  exports: [],
})
export class EnterpriseModule {}
