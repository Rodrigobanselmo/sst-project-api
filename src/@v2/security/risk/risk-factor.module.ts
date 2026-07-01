import { SharedModule } from '@/@v2/shared/shared.module';
import { Module } from '@nestjs/common';
import { FormModule } from '@/@v2/forms/forms.module';

import { RiskFactorAiSuggestionsController } from './application/risk-factor-ai-suggestions/controllers/risk-factor-ai-suggestions.controller';
import { RiskFactorAiSuggestionsPromptService } from './application/risk-factor-ai-suggestions/services/risk-factor-ai-suggestions-prompt.service';
import { RiskFactorAiSuggestionsUseCase } from './application/risk-factor-ai-suggestions/use-cases/risk-factor-ai-suggestions.usecase';
import { BrowseSubTypeController } from './application/sub-type/browse-sub-type/controllers/browse-sub-type.controller';
import { BrowseSubTypeUseCase } from './application/sub-type/browse-sub-type/use-cases/browse-sub-type.usecase';
import { RiskSubTypeMasterController } from './application/sub-type/risk-sub-type-master/risk-sub-type-master.controller';
import { RiskSubTypeMasterRepository } from './application/sub-type/risk-sub-type-master/risk-sub-type-master.repository';
import { RiskSubTypeMasterService } from './application/sub-type/risk-sub-type-master/risk-sub-type-master.service';
import { SubTypeDAO } from './database/dao/sub-type/sub-type.dao';

@Module({
  imports: [SharedModule, FormModule],
  controllers: [
    BrowseSubTypeController,
    RiskFactorAiSuggestionsController,
    RiskSubTypeMasterController,
  ],
  providers: [
    SubTypeDAO,
    BrowseSubTypeUseCase,
    RiskFactorAiSuggestionsPromptService,
    RiskFactorAiSuggestionsUseCase,
    RiskSubTypeMasterRepository,
    RiskSubTypeMasterService,
  ],
  exports: [],
})
export class RiskFactorModule {}
