import { BrowseCommentsUseCase } from './application/comment/browse-comments/use-cases/browse-comments.usecase';
import { BrowseCommentsController } from './application/comment/browse-comments/controllers/browse-comment.controller';
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
import { EditManyCommentController } from './application/comment/edit-many-commets/controllers/edit-many-commet.controller';
import { EditManyCommentsUseCase } from './application/comment/edit-many-commets/use-cases/edit-many-commets.usecase';
import { ActionPlanInfoDAO } from './database/dao/action-plan-info/action-plan-info.dao';
import { ReadActionPlanInfoUseCase } from './application/action-plan-info/read-action-plan-info/use-cases/find-action-plan-info.usecase';
import { FindActionPlanInfoController } from './application/action-plan-info/read-action-plan-info/controllers/read-action-plan-info.controller';
import { ActionPlanInfoAggregateRepository } from '@/@v2/security/action-plan/database/repositories/action-plan-info/action-plan-aggregate.repository';
import { CoordinatorRepository } from './database/repositories/coordinator/coordinator.repository';
import { EditActionPlanInfoUseCase } from './application/action-plan-info/edit-action-plan-info/use-cases/edit-action-plan-info.usecase';
import { EditActionPlanInfoController } from './application/action-plan-info/edit-action-plan-info/controllers/edit-action-plan-info.controller';
import { CommentDAO } from './database/dao/comment/comment.dao';
import { UserDAO } from './database/dao/user/user.dao';
import { BrowseResponsiblesUseCase } from './application/user/browse-responsible/use-cases/browse-responsibles.usecase';
import { BrowseResponsiblesController } from './application/user/browse-responsible/controllers/browse-responsible.controller';
import { BrowseCoordinatorsUseCase } from './application/user/browse-coordinators/use-cases/browse-coordinators.usecase';
import { BrowseCoordinatorsController } from './application/user/browse-coordinators/controllers/browse-coordinators.controller';
import { EditActionPlanController } from './application/action-plan/edit-action-plan/controllers/edit-action-plan.controller';
import { HierarchyDAO } from './database/dao/hierarchy/hierarchy.dao';
import { BrowseHierarchiesUseCase } from './application/hierarchy/browse-hierarchies/use-cases/browse-hierarchies.usecase';
import { BrowseHierarchiesController } from './application/hierarchy/browse-hierarchies/controllers/browse-hierarchies.controller';
import { BrowseCommentCreatorsController } from './application/user/browse-comment-creators/controllers/browse-comment-creators.controller';
import { BrowseCommentCreatorsUseCase } from './application/user/browse-comment-creators/use-cases/browse-comment-creators.usecase';
import { ResponsibleDAO } from './database/dao/responsible/responsible.dao';
import { OriginDAO } from './database/dao/origin/origin.dao';

@Module({
  imports: [SharedModule],
  controllers: [
    BrowseActionPlanController,
    EditActionPlanController,
    EditManyActionPlanController,
    FindActionPlanInfoController,
    EditManyCommentController,
    EditActionPlanInfoController,
    BrowseResponsiblesController,
    BrowseCoordinatorsController,
    BrowseHierarchiesController,
    BrowseCommentsController,
    BrowseCommentCreatorsController,
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
    UserDAO,
    HierarchyDAO,
    ResponsibleDAO,
    OriginDAO,

    // Use Cases
    BrowseActionPlanUseCase,
    EditManyActionPlanUseCase,
    EditActionPlanUseCase,
    EditManyCommentsUseCase,
    ReadActionPlanInfoUseCase,
    EditActionPlanInfoUseCase,
    BrowseResponsiblesUseCase,
    BrowseCoordinatorsUseCase,
    BrowseHierarchiesUseCase,
    BrowseCommentsUseCase,
    BrowseCommentCreatorsUseCase,

    // Services
    EditActionPlanService,
    EditCommentService,
  ],
  exports: [],
})
export class ActionPlanModule {}
