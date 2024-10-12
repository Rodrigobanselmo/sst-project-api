import { Module } from '@nestjs/common';
import { SharedModule } from '../shared/shared.module';
import { BrowseCharacterizationController } from './application/characterization/browse-characterizations/controllers/browse-characterizations.controller';
import { BrowseCharacterizationUseCase } from './application/characterization/browse-characterizations/use-cases/browse-characterizations.usecase';
import { AddStatusController } from './application/status/add-status/controllers/add-status.controller';
import { AddStatusUseCase } from './application/status/add-status/use-cases/add-status.usecase';
import { BrowseStatusController } from './application/status/browse-status/controllers/browse-status.controller';
import { BrowseStatusUseCase } from './application/status/browse-status/use-cases/browse-status.usecase';
import { DeleteStatusController } from './application/status/delete-status/controllers/delete-status.controller';
import { DeleteStatusUseCase } from './application/status/delete-status/use-cases/delete-status.usecase';
import { EditStatusController } from './application/status/edit-status/controllers/edit-status.controller';
import { EditStatusUseCase } from './application/status/edit-status/use-cases/edit-status.usecase';
import { CharacterizationDAO } from './database/dao/characterization/characterization.dao';
import { StatusDAO } from './database/dao/status/status.dao';
import { StatusRepository } from './database/repositories/status/status.repository';


@Module({
  imports: [SharedModule],
  controllers: [
    BrowseCharacterizationController,

    AddStatusController,
    EditStatusController,
    BrowseStatusController,
    DeleteStatusController,
  ],
  providers: [
    // Database
    StatusRepository,
    CharacterizationDAO,
    StatusDAO,

    // Use Cases
    BrowseCharacterizationUseCase,

    AddStatusUseCase,
    BrowseStatusUseCase,
    EditStatusUseCase,
    DeleteStatusUseCase,
  ],
  exports: []
})
export class SecurityModule { }
