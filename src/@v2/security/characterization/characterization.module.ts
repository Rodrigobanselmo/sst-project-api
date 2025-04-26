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
import { PhotoRecommendationRepository } from './database/repositories/photo-recommendation/photo-recommendation.repository';
import { EditManyPhotoRecommendationUseCase } from './application/photo-recommendation/edit-many-photo-recommendation/use-cases/edit-many-photo-recommendation.usecase';
import { EditManyPhotoRecommendationController } from './application/photo-recommendation/edit-many-photo-recommendation/controllers/edit-many-photo-recommendation.controller';
import { EditPhotoRecommendationService } from './services/edit-photo-recommendation/edit-photo-recommendation.service';

@Module({
  imports: [SharedModule],
  controllers: [BrowseCharacterizationController, EditManyCharacterizationController, EditManyPhotoRecommendationController],
  providers: [
    // Database
    CharacterizationDAO,
    CharacterizationRepository,
    PhotoRecommendationRepository,
    RiskDataDAO,

    // Use Cases
    BrowseCharacterizationUseCase,
    EditManyCharacterizationUseCase,
    EditManyPhotoRecommendationUseCase,

    //Services
    EditCharacterizationService,
    EditPhotoRecommendationService,
  ],
  exports: [],
})
export class CharacterizationModule {}
