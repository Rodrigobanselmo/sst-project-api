import { SharedModule } from '@/@v2/shared/shared.module';
import { Module } from '@nestjs/common';
import { ListHierarchyTypesController } from './application/hierarchy/list-hierarchy-types/controllers/list-hierarchy-types.controller';
import { ListHierarchyTypesUseCase } from './application/hierarchy/list-hierarchy-types/use-cases/list-hierarchy-types.usecase';
import { HierarchyDAO } from './database/dao/hierarchy/hierarchy.dao';

@Module({
  imports: [SharedModule],
  controllers: [
    ListHierarchyTypesController
  ],
  providers: [
    // Database
    HierarchyDAO,

    // Use Cases
    ListHierarchyTypesUseCase
  ],
  exports: []
})
export class HierarchyModule { }
