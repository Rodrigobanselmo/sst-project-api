import { Module } from '@nestjs/common';
import { AddTaskController } from './application/task/add-task/controllers/add-task.controller';
import { AddTaskUseCase } from './application/task/add-task/use-cases/add-task.usecase';
import { BrowseTaskController } from './application/task/browse-task/controllers/browse-task.controller';
import { BrowseTaskUseCase } from './application/task/browse-task/use-cases/browse-task.usecase';
import { DeleteTaskController } from './application/task/delete-task/controllers/delete-task.controller';
import { DeleteTaskUseCase } from './application/task/delete-task/use-cases/delete-task.usecase';
import { EditTaskController } from './application/task/edit-task/controllers/edit-task.controller';
import { EditTaskUseCase } from './application/task/edit-task/use-cases/edit-task.usecase';
import { SharedModule } from '@/@v2/shared/shared.module';
import { TaskDAO } from './database/dao/task/task.dao';
import { TaskAggregateRepository } from './database/repositories/task/task-aggregate.repository';
import { TaskActionPlanRepository } from './database/repositories/task-action-plan/task-action-plan.repository';
import { TaskProjectRepository } from './database/repositories/task-project/task-project.repository';
import { CreateTaskPhotosService } from './services/create-task-photos/create-task-photos.service';

@Module({
  imports: [SharedModule],
  controllers: [AddTaskController, EditTaskController, BrowseTaskController, DeleteTaskController],
  providers: [
    // Database
    TaskDAO,
    TaskAggregateRepository,
    TaskActionPlanRepository,
    TaskProjectRepository,

    // Use Cases
    AddTaskUseCase,
    BrowseTaskUseCase,
    EditTaskUseCase,
    DeleteTaskUseCase,

    // Services
    CreateTaskPhotosService,
  ],
  exports: [],
})
export class TaskModule {}
