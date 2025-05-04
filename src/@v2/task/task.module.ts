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
import { ReadTaskController } from './application/task/read-task/controllers/read-task.controller';
import { ReadTaskUseCase } from './application/task/read-task/use-cases/read-task.usecase';
import { TaskProjectAggregateRepository } from './database/repositories/task-project/task-project-aggregate.repository';
import { AddTaskProjectUseCase } from './application/task-project/add-task-project/use-cases/add-task-project.usecase';
import { BrowseTaskProjectUseCase } from './application/task-project/browse-task-project/use-cases/browse-task-project.usecase';
import { EditTaskProjectUseCase } from './application/task-project/edit-task-project/use-cases/edit-task-project.usecase';
import { DeleteTaskProjectUseCase } from './application/task-project/delete-task-project/use-cases/delete-task-project.usecase';
import { ReadTaskProjectUseCase } from './application/task-project/read-task-project/use-cases/read-task-project.usecase';
import { ReadTaskProjectController } from './application/task-project/read-task-project/controllers/read-task-project.controller';
import { AddTaskProjectController } from './application/task-project/add-task-project/controllers/add-task-project.controller';
import { EditTaskProjectController } from './application/task-project/edit-task-project/controllers/edit-task-project.controller';
import { BrowseTaskProjectController } from './application/task-project/browse-task-project/controllers/browse-task-project.controller';
import { DeleteTaskProjectController } from './application/task-project/delete-task-project/controllers/delete-task-project.controller';

@Module({
  imports: [SharedModule],
  controllers: [
    ReadTaskController,
    AddTaskController,
    EditTaskController,
    BrowseTaskController,
    DeleteTaskController,
    ReadTaskProjectController,
    AddTaskProjectController,
    EditTaskProjectController,
    BrowseTaskProjectController,
    DeleteTaskProjectController,
  ],
  providers: [
    // Database
    TaskDAO,
    TaskAggregateRepository,
    TaskActionPlanRepository,
    TaskProjectRepository,
    TaskProjectAggregateRepository,

    // Use Cases
    AddTaskUseCase,
    BrowseTaskUseCase,
    EditTaskUseCase,
    DeleteTaskUseCase,
    ReadTaskUseCase,
    AddTaskProjectUseCase,
    BrowseTaskProjectUseCase,
    EditTaskProjectUseCase,
    DeleteTaskProjectUseCase,
    ReadTaskProjectUseCase,

    // Services
    CreateTaskPhotosService,
  ],
  exports: [],
})
export class TaskModule {}
