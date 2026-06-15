import { Injectable } from '@nestjs/common';

import { UserPayloadDto } from '@/shared/dto/user-payload.dto';

import {
  CompanyGroupConsolidatedViewIndicatorsNarrativeDiagnosticService,
  ConsolidatedIndicatorsNarrativeDiagnosticResult,
} from '../services/company-group-consolidated-view-indicators-narrative-diagnostic.service';
import { ConsolidatedIndicatorsNarrativeScope } from '../utils/consolidated-indicators-narrative-scope.types';

export namespace ICompanyGroupConsolidatedViewIndicatorsNarrativeDiagnosticReadUseCase {
  export type Params = {
    companyGroupId: number;
    applicationIds?: string[];
    scopeKey?: string;
    scope: ConsolidatedIndicatorsNarrativeScope;
    user: UserPayloadDto;
  };

  export type Result = ConsolidatedIndicatorsNarrativeDiagnosticResult | null;
}

@Injectable()
export class CompanyGroupConsolidatedViewIndicatorsNarrativeDiagnosticReadUseCase {
  constructor(
    private readonly service: CompanyGroupConsolidatedViewIndicatorsNarrativeDiagnosticService,
  ) {}

  execute(
    params: ICompanyGroupConsolidatedViewIndicatorsNarrativeDiagnosticReadUseCase.Params,
  ): Promise<ICompanyGroupConsolidatedViewIndicatorsNarrativeDiagnosticReadUseCase.Result> {
    return this.service.read(params);
  }
}
