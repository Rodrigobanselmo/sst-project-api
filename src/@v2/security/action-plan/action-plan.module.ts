import { Module } from '@nestjs/common';
import { ActionPlanDAO } from './database/dao/action-plan/action-plan.dao';
import { BrowseActionPlanController } from './application/action-plan/browse-action-plan/controllers/browse-action-plan.controller';
import { BrowseActionPlanUseCase } from './application/action-plan/browse-action-plan/use-cases/browse-action-plan.usecase';
import { SharedModule } from '@/@v2/shared/shared.module';
import { ActionPlanRepository } from './database/repositories/action-plan/action-plan.repository';
import { EditActionPlanService } from './services/edit-action-plan/edit-action-plan.service';
import { EditManyActionPlanUseCase } from './application/action-plan/edit-many-action-plan/use-cases/edit-many-action-plan.usecase';
import { EditManyActionPlanController } from './application/action-plan/edit-many-action-plan/controllers/edit-many-action-plan.controller';
import { CommentRepository } from './database/repositories/comment/comment.repository';

@Module({
  imports: [SharedModule],
  controllers: [
    BrowseActionPlanController,
    EditManyActionPlanController,
  ],
  providers: [
    // Database
    ActionPlanDAO,
    ActionPlanRepository,
    CommentRepository,

    // Use Cases
    BrowseActionPlanUseCase,
    EditManyActionPlanUseCase,

    // Services
    EditActionPlanService,
  ],
  exports: []
})
export class ActionPlanModule { }
