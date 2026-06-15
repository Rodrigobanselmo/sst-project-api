import { Injectable } from '@nestjs/common';

import { UserPayloadDto } from '@/shared/dto/user-payload.dto';

import {
  CompanyGroupConsolidatedViewIndicatorsNarrativeDiagnosticService,
  ConsolidatedIndicatorsNarrativeDiagnosticResult,
} from '../services/company-group-consolidated-view-indicators-narrative-diagnostic.service';
import { ConsolidatedIndicatorsNarrativeScope } from '../utils/consolidated-indicators-narrative-scope.types';

export namespace ICompanyGroupConsolidatedViewIndicatorsNarrativeDiagnosticGenerateUseCase {
  export type Params = {
    companyGroupId: number;
    applicationIds?: string[];
    scope: ConsolidatedIndicatorsNarrativeScope;
    customPrompt?: string;
    model?: string;
    regenerate?: boolean;
    user: UserPayloadDto;
  };

  export type Result = ConsolidatedIndicatorsNarrativeDiagnosticResult;
}

@Injectable()
export class CompanyGroupConsolidatedViewIndicatorsNarrativeDiagnosticGenerateUseCase {
  constructor(
    private readonly service: CompanyGroupConsolidatedViewIndicatorsNarrativeDiagnosticService,
  ) {}

  execute(
    params: ICompanyGroupConsolidatedViewIndicatorsNarrativeDiagnosticGenerateUseCase.Params,
  ): Promise<ICompanyGroupConsolidatedViewIndicatorsNarrativeDiagnosticGenerateUseCase.Result> {
    return this.service.generate(params);
  }
}
