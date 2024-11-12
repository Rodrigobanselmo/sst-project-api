import { Module } from '@nestjs/common';
import { ActionPlanDAO } from './database/dao/action-plan/action-plan.dao';
import { BrowseActionPlanController } from './application/action-plan/browse-action-plan/controllers/browse-action-plan.controller';
import { BrowseActionPlanUseCase } from './application/action-plan/browse-action-plan/use-cases/browse-action-plan.usecase';
import { SharedModule } from '@/@v2/shared/shared.module';
import { ActionPlanAggregateRepository } from './database/repositories/action-plan/action-plan-aggregate.repository';
import { EditActionPlanService } from './services/edit-action-plan/edit-action-plan.service';
import { EditManyActionPlanUseCase } from './application/action-plan/edit-many-action-plan/use-cases/edit-many-action-plan.usecase';
import { EditManyActionPlanController } from './application/action-plan/edit-many-action-plan/controllers/edit-many-action-plan.controller';
import { CommentAggregateRepository } from './database/repositories/comment/comment-aggregate.repository';
import { EditCommentService } from './services/edit-comment/edit-comment.service';
import { EditActionPlanUseCase } from './application/action-plan/edit-action-plan/use-cases/edit-action-plan.usecase';
import { EditManyCommentController } from './application/comments/edit-many-commets/controllers/edit-many-commet.controller';
import { EditManyCommentsUseCase } from './application/comments/edit-many-commets/use-cases/edit-many-commets.usecase';
import { ActionPlanInfoDAO } from './database/dao/action-plan-info/action-plan-info.dao';
import { FindActionPlanInfoUseCase } from './application/action-plan-info/browse-action-plan-info/use-cases/find-action-plan-info.usecase';
import { FindActionPlanInfoController } from './application/action-plan-info/browse-action-plan-info/controllers/browse-action-plan-info.controller';
import { ActionPlanInfoAggregateRepository } from './database/repositories/action-plan-info/action-plan-aggregate.repository';
import { CoordinatorRepository } from './database/repositories/coordinator/coordinator.repository';
import { EditActionPlanInfoUseCase } from './application/action-plan-info/edit-action-plan-info/use-cases/edit-action-plan-info.usecase';
import { EditActionPlanInfoController } from './application/action-plan-info/edit-action-plan-info/controllers/edit-action-plan-info.controller';
import { CommentDAO } from './database/dao/comment/comment.dao';

@Module({
  imports: [SharedModule],
  controllers: [
    BrowseActionPlanController,
    EditManyActionPlanController,
    FindActionPlanInfoController,
    EditManyCommentController,
    EditActionPlanInfoController
  ],
  providers: [
    // Database
    ActionPlanDAO,
    ActionPlanInfoDAO,
    ActionPlanAggregateRepository,
    CommentAggregateRepository,
    ActionPlanInfoAggregateRepository,
    CoordinatorRepository,
    CommentDAO,

    // Use Cases
    BrowseActionPlanUseCase,
    EditManyActionPlanUseCase,
    EditActionPlanUseCase,
    EditManyCommentsUseCase,
    FindActionPlanInfoUseCase,
    EditActionPlanInfoUseCase,

    // Services
    EditActionPlanService,
    EditCommentService
  ],
  exports: []
})
export class ActionPlanModule { }
