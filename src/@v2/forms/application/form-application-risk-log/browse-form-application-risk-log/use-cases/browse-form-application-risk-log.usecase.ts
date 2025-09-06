import { Injectable } from '@nestjs/common';
import { FormApplicationRiskLogDAO } from '@/@v2/forms/database/dao/form-application-risk-log/form-application-risk-log.dao';
import { IBrowseFormApplicationRiskLogUseCase } from './browse-form-application-risk-log.types';

@Injectable()
export class BrowseFormApplicationRiskLogUseCase {
  constructor(private readonly formApplicationRiskLogDAO: FormApplicationRiskLogDAO) {}

  async execute(params: IBrowseFormApplicationRiskLogUseCase.Params) {
    const riskLogs = await this.formApplicationRiskLogDAO.browseByApplication({
      companyId: params.companyId,
      applicationId: params.applicationId,
    });

    return riskLogs;
  }
}
