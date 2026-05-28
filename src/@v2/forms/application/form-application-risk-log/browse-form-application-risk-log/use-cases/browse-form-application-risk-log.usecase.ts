import { Injectable } from '@nestjs/common';
import { FormApplicationRiskInventoryStatusService } from '@/@v2/forms/application/shared/services/form-application-risk-inventory-status.service';
import { FormApplicationRiskLogDAO } from '@/@v2/forms/database/dao/form-application-risk-log/form-application-risk-log.dao';
import { IBrowseFormApplicationRiskLogUseCase } from './browse-form-application-risk-log.types';

@Injectable()
export class BrowseFormApplicationRiskLogUseCase {
  constructor(
    private readonly formApplicationRiskLogDAO: FormApplicationRiskLogDAO,
    private readonly formApplicationRiskInventoryStatusService: FormApplicationRiskInventoryStatusService,
  ) {}

  async execute(params: IBrowseFormApplicationRiskLogUseCase.Params) {
    const riskLogs = await this.formApplicationRiskLogDAO.browseByApplication({
      companyId: params.companyId,
      applicationId: params.applicationId,
    });

    if (riskLogs.length === 0) {
      return riskLogs;
    }

    const inventoryStatusByKey =
      await this.formApplicationRiskInventoryStatusService.resolveInventoryStatusForPairs(
        {
          formApplicationId: params.applicationId,
          accessCompanyId: params.companyId,
          pairs: riskLogs.map((log) => ({
            riskId: log.riskId,
            hierarchyId: log.entityId,
          })),
        },
      );

    return riskLogs.map((log) => {
      const key = this.formApplicationRiskInventoryStatusService.buildStatusKey(
        log.riskId,
        log.entityId,
      );

      return {
        ...log,
        existsInInventory: inventoryStatusByKey[key] === true,
      };
    });
  }
}
