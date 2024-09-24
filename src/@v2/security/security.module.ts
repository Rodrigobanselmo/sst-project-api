import { Module } from '@nestjs/common'
import { SharedModule } from '../shared/shared.module';
import { BrowseCharacterizationController } from './application/characterization/browse-characterizations/controllers/browse-characterizations.controller';
import { BrowseCharacterizationUseCase } from './application/characterization/browse-characterizations/use-cases/browse-characterizations.usecase';
import { CharacterizationDAO } from './database/dao/characterization/characterization.dao';


@Module({
  imports: [SharedModule],
  controllers: [
    BrowseCharacterizationController,
  ],
  providers: [
    // Database
    CharacterizationDAO,

    // Use Cases
    BrowseCharacterizationUseCase,
  ],
  exports: []
})
export class SecurityModule { }
