import { Module } from '@nestjs/common';
import { AddStatusController } from './application/status/add-status/controllers/add-status.controller';
import { AddStatusUseCase } from './application/status/add-status/use-cases/add-status.usecase';
import { BrowseStatusController } from './application/status/browse-status/controllers/browse-status.controller';
import { BrowseStatusUseCase } from './application/status/browse-status/use-cases/browse-status.usecase';
import { DeleteStatusController } from './application/status/delete-status/controllers/delete-status.controller';
import { DeleteStatusUseCase } from './application/status/delete-status/use-cases/delete-status.usecase';
import { EditStatusController } from './application/status/edit-status/controllers/edit-status.controller';
import { EditStatusUseCase } from './application/status/edit-status/use-cases/edit-status.usecase';
import { StatusDAO } from './database/dao/status/status.dao';
import { StatusRepository } from './database/repositories/status/status.repository';
import { SharedModule } from '@/@v2/shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [
    AddStatusController,
    EditStatusController,
    BrowseStatusController,
    DeleteStatusController,
  ],
  providers: [
    // Database
    StatusRepository,
    StatusDAO,

    // Use Cases
    AddStatusUseCase,
    BrowseStatusUseCase,
    EditStatusUseCase,
    DeleteStatusUseCase,
  ],
  exports: []
})
export class StatusModule { }
