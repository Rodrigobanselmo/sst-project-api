import { Injectable } from '@nestjs/common';

import { CompanyGroupConsolidatedViewRiskNarrativeDiagnosticService } from '../services/company-group-consolidated-view-risk-narrative-diagnostic.service';
import { ConsolidatedRiskNarrativeScope } from '../utils/consolidated-risk-narrative-scope.types';

export namespace ICompanyGroupConsolidatedViewRiskNarrativeDiagnosticGenerateUseCase {
  export type Params = {
    companyGroupId: number;
    applicationIds?: string[];
    scope: ConsolidatedRiskNarrativeScope;
    customPrompt?: string;
    model?: string;
    regenerate?: boolean;
    user: import('@/shared/dto/user-payload.dto').UserPayloadDto;
  };
}

@Injectable()
export class CompanyGroupConsolidatedViewRiskNarrativeDiagnosticGenerateUseCase {
  constructor(
    private readonly service: CompanyGroupConsolidatedViewRiskNarrativeDiagnosticService,
  ) {}

  execute(params: ICompanyGroupConsolidatedViewRiskNarrativeDiagnosticGenerateUseCase.Params) {
    return this.service.generate(params);
  }
}
