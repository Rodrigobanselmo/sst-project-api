import { Module } from '@nestjs/common';
import { BrowseCharacterizationController } from './application/characterization/browse-characterizations/controllers/browse-characterizations.controller';
import { BrowseCharacterizationUseCase } from './application/characterization/browse-characterizations/use-cases/browse-characterizations.usecase';
import { CharacterizationDAO } from './database/dao/characterization/characterization.dao';
import { RiskDataDAO } from './database/dao/risk-data/risk-data.dao';
import { SharedModule } from '@/@v2/shared/shared.module';
import { CharacterizationRepository } from './database/repositories/characterization/characterization.repository';
import { EditCharacterizationService } from './services/edit-characterization/edit-characterization.service';
import { EditManyCharacterizationController } from './application/characterization/edit-many-characterization/controllers/edit-many-characterization.controller';
import { EditManyCharacterizationUseCase } from './application/characterization/edit-many-characterization/use-cases/edit-many-characterization.usecase';

@Module({
  imports: [SharedModule],
  controllers: [BrowseCharacterizationController, EditManyCharacterizationController],
  providers: [
    // Database
    CharacterizationDAO,
    CharacterizationRepository,
    RiskDataDAO,

    // Use Cases
    BrowseCharacterizationUseCase,
    EditManyCharacterizationUseCase,

    //Services
    EditCharacterizationService,
  ],
  exports: [],
})
export class CharacterizationModule {}
