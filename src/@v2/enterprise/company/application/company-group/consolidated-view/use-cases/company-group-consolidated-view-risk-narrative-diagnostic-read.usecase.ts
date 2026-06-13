import { Injectable } from '@nestjs/common';

import { CompanyGroupConsolidatedViewRiskNarrativeDiagnosticService } from '../services/company-group-consolidated-view-risk-narrative-diagnostic.service';
import { ConsolidatedRiskNarrativeScope } from '../utils/consolidated-risk-narrative-scope.types';

export namespace ICompanyGroupConsolidatedViewRiskNarrativeDiagnosticReadUseCase {
  export type Params = {
    companyGroupId: number;
    applicationIds?: string[];
    scopeKey?: string;
    scope: ConsolidatedRiskNarrativeScope;
    user: import('@/shared/dto/user-payload.dto').UserPayloadDto;
  };
}

@Injectable()
export class CompanyGroupConsolidatedViewRiskNarrativeDiagnosticReadUseCase {
  constructor(
    private readonly service: CompanyGroupConsolidatedViewRiskNarrativeDiagnosticService,
  ) {}

  execute(params: ICompanyGroupConsolidatedViewRiskNarrativeDiagnosticReadUseCase.Params) {
    return this.service.read(params);
  }
}
