import { Module } from '@nestjs/common'
import { SharedModule } from '../shared/shared.module';
import { BrowseCharacterizationController } from './application/characterization/browse-characterizations/controllers/browse-characterizations.controller';
import { BrowseCharacterizationUseCase } from './application/characterization/browse-characterizations/use-cases/browse-characterizations.usecase';
import { CharacterizationDAO } from './database/dao/characterization/characterization.dao';
import { StatusDAO } from './database/dao/status/status.dao';
import { StatusRepository } from './database/repositories/status/status.repository';
import { AddStatusController } from './application/status/add-status/controllers/add-status.controller';
import { AddStatusUseCase } from './application/status/add-status/use-cases/add-status.usecase';
import { EditStatusController } from './application/status/edit-status/controllers/edit-status.controller';


@Module({
  imports: [SharedModule],
  controllers: [
    BrowseCharacterizationController,

    AddStatusController,
    EditStatusController,
  ],
  providers: [
    // Database
    StatusRepository,
    CharacterizationDAO,
    StatusDAO,

    // Use Cases
    BrowseCharacterizationUseCase,
    AddStatusUseCase,
  ],
  exports: []
})
export class SecurityModule { }
