import { SharedModule } from '@/@v2/shared/shared.module';
import { Module } from '@nestjs/common';
import { EditHierarchyController } from './application/hierarchy/edit-hierarchy/controllers/edit-hierarchy.controller';
import { EditHierarchyUseCase } from './application/hierarchy/edit-hierarchy/use-cases/edit-hierarchy.usecase';
import { ListHierarchyTypesController } from './application/hierarchy/list-hierarchy-types/controllers/list-hierarchy-types.controller';
import { ListHierarchyTypesUseCase } from './application/hierarchy/list-hierarchy-types/use-cases/list-hierarchy-types.usecase';
import { HierarchyDAO } from './database/dao/hierarchy/hierarchy.dao';

@Module({
  imports: [SharedModule],
  controllers: [ListHierarchyTypesController, EditHierarchyController],
  providers: [
    // Database
    HierarchyDAO,

    // Use Cases
    ListHierarchyTypesUseCase,
    EditHierarchyUseCase,
  ],
  exports: [],
})
export class HierarchyModule {}
