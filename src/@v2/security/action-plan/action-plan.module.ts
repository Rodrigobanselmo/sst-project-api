import { ActionPlanInfoAggregateRepository } from '@/@v2/security/action-plan/database/repositories/action-plan-info/action-plan-aggregate.repository';
import { SharedModule } from '@/@v2/shared/shared.module';
import { Module } from '@nestjs/common';
import { EditActionPlanInfoController } from './application/action-plan-info/edit-action-plan-info/controllers/edit-action-plan-info.controller';
import { EditActionPlanInfoUseCase } from './application/action-plan-info/edit-action-plan-info/use-cases/edit-action-plan-info.usecase';
import { FindActionPlanInfoController } from './application/action-plan-info/read-action-plan-info/controllers/read-action-plan-info.controller';
import { ReadActionPlanInfoUseCase } from './application/action-plan-info/read-action-plan-info/use-cases/find-action-plan-info.usecase';
import { BrowseActionPlanController } from './application/action-plan/browse-action-plan/controllers/browse-action-plan.controller';
import { BrowseActionPlanUseCase } from './application/action-plan/browse-action-plan/use-cases/browse-action-plan.usecase';
import { EditActionPlanController } from './application/action-plan/edit-action-plan/controllers/edit-action-plan.controller';
import { EditActionPlanUseCase } from './application/action-plan/edit-action-plan/use-cases/edit-action-plan.usecase';
import { EditManyActionPlanController } from './application/action-plan/edit-many-action-plan/controllers/edit-many-action-plan.controller';
import { EditManyActionPlanUseCase } from './application/action-plan/edit-many-action-plan/use-cases/edit-many-action-plan.usecase';
import { ReadActionPlanController } from './application/action-plan/read-action-plan/controllers/read-action-plan.controller';
import { ReadActionPlanUseCase } from './application/action-plan/read-action-plan/use-cases/read-action-plan.usecase';
import { BrowseCommentsController } from './application/comment/browse-comments/controllers/browse-comment.controller';
import { BrowseCommentsUseCase } from './application/comment/browse-comments/use-cases/browse-comments.usecase';
import { EditManyCommentController } from './application/comment/edit-many-commets/controllers/edit-many-commet.controller';
import { EditManyCommentsUseCase } from './application/comment/edit-many-commets/use-cases/edit-many-commets.usecase';
import { BrowseHierarchiesController } from './application/hierarchy/browse-hierarchies/controllers/browse-hierarchies.controller';
import { BrowseHierarchiesUseCase } from './application/hierarchy/browse-hierarchies/use-cases/browse-hierarchies.usecase';
import { BrowseCommentCreatorsController } from './application/user/browse-comment-creators/controllers/browse-comment-creators.controller';
import { BrowseCommentCreatorsUseCase } from './application/user/browse-comment-creators/use-cases/browse-comment-creators.usecase';
import { BrowseCoordinatorsController } from './application/user/browse-coordinators/controllers/browse-coordinators.controller';
import { BrowseCoordinatorsUseCase } from './application/user/browse-coordinators/use-cases/browse-coordinators.usecase';
import { BrowseResponsiblesController } from './application/user/browse-responsible/controllers/browse-responsible.controller';
import { BrowseResponsiblesUseCase } from './application/user/browse-responsible/use-cases/browse-responsibles.usecase';
import { ActionPlanInfoDAO } from './database/dao/action-plan-info/action-plan-info.dao';
import { ActionPlanDAO } from './database/dao/action-plan/action-plan.dao';
import { CommentDAO } from './database/dao/comment/comment.dao';
import { HierarchyDAO } from './database/dao/hierarchy/hierarchy.dao';
import { ResponsibleDAO } from './database/dao/responsible/responsible.dao';
import { UserDAO } from './database/dao/user/user.dao';
import { ActionPlanAggregateRepository } from './database/repositories/action-plan/action-plan-aggregate.repository';
import { CommentAggregateRepository } from './database/repositories/comment/comment-aggregate.repository';
import { CoordinatorRepository } from './database/repositories/coordinator/coordinator.repository';
import { EditActionPlanService } from './services/edit-action-plan/edit-action-plan.service';
import { EditCommentService } from './services/edit-comment/edit-comment.service';
import { ActionPlanPhotoAggregateRepository } from './database/repositories/action-plan-photo/action-plan-photo-aggregate.repository';
import { AddActionPlanPhotoFileController } from './application/action-plan-photo/add-action-plan-photo-file/controllers/add-action-plan-photo-file.controller';
import { AddActionPlanPhotoFileUseCase } from './application/action-plan-photo/add-action-plan-photo-file/use-cases/add-action-plan-photo-file.usecase';
import { DeleteActionPlanPhotoFileController } from './application/action-plan-photo/delete-action-plan-photo-file/controllers/delete-action-plan-photo-file.controller';
import { DeleteActionPlanPhotoFileUseCase } from './application/action-plan-photo/delete-action-plan-photo-file/use-cases/delete-action-plan-photo-file.usecase';
import { NewTasksActionPlanCron } from './application/action-plan/notify-new-tasks-action-plan/cron/notify-new-tasks-action-plan.cron';
import { ActionPlanRepository } from './database/repositories/action-plan/action-plan.repository';
import { AllTasksActionPlanCron } from './application/action-plan/notify-all-tasks-action-plan/cron/notify-all-tasks-action-plan.cron';
import { NewTasksActionPlanUseCase } from './application/action-plan/notify-new-tasks-action-plan/use-cases/notify-new-tasks-action-plan.usecase';
import { AllTasksActionPlanUseCase } from './application/action-plan/notify-all-tasks-action-plan/use-cases/notify-all-tasks-action-plan.usecase';
import { ActionPlanRuleAggregateRepository } from './database/repositories/action-plan-rule/action-plan-rule-aggregate.repository';

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
    ReadActionPlanController,
    AddActionPlanPhotoFileController,
    DeleteActionPlanPhotoFileController,
  ],
  providers: [
    // Crons
    NewTasksActionPlanCron,
    AllTasksActionPlanCron,

    // Database
    ActionPlanDAO,
    ActionPlanInfoDAO,
    ActionPlanAggregateRepository,
    CommentAggregateRepository,
    ActionPlanInfoAggregateRepository,
    CoordinatorRepository,
    ActionPlanPhotoAggregateRepository,
    CommentDAO,
    UserDAO,
    HierarchyDAO,
    ResponsibleDAO,
    ActionPlanRepository,
    ActionPlanRuleAggregateRepository,

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
    ReadActionPlanUseCase,
    AddActionPlanPhotoFileUseCase,
    DeleteActionPlanPhotoFileUseCase,
    NewTasksActionPlanUseCase,
    AllTasksActionPlanUseCase,

    // Services
    EditActionPlanService,
    EditCommentService,
  ],
  exports: [],
})
export class ActionPlanModule {}
