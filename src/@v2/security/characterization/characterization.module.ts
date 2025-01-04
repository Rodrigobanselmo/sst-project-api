import { Module } from '@nestjs/common';
import { BrowseCharacterizationController } from './application/characterization/browse-characterizations/controllers/browse-characterizations.controller';
import { BrowseCharacterizationUseCase } from './application/characterization/browse-characterizations/use-cases/browse-characterizations.usecase';
import { CharacterizationDAO } from './database/dao/characterization/characterization.dao';
import { RiskDataDAO } from './database/dao/risk-data/risk-data.dao';
import { SharedModule } from '@/@v2/shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [
    BrowseCharacterizationController,
  ],
  providers: [
    // Database
    CharacterizationDAO,
    RiskDataDAO,

    // Use Cases
    BrowseCharacterizationUseCase,
  ],
  exports: []
})
export class CharacterizationModule { }
