import { AbsenteeismMetricsDAO } from '@/@v2/enterprise/absenteeism/database/dao/absenteeism-metrics/absenteeism-metrics.dao';
import { Injectable } from '@nestjs/common';
import { IAbsenteeismUseCase } from './browse-absenteeism.types';

@Injectable()
export class BrowseAbsenteeismEmployeeTotalUseCase {
  constructor(private readonly absenteeismMetricsDAO: AbsenteeismMetricsDAO) {}

  async execute(params: IAbsenteeismUseCase.Params) {
    const result = await this.absenteeismMetricsDAO.browseEmployeeTotal({
      page: params.pagination.page,
      limit: params.pagination.limit,
      orderBy: params.orderBy,
      filters: {
        search: params.search,
        companyId: params.companyId,
        workspacesIds: params.workspacesIds,
        endDate: params.endDate,
        hierarchiesIds: params.hierarchiesIds,
        motivesIds: params.motivesIds,
        startDate: params.startDate,
      },
    });

    return result;
  }
}
