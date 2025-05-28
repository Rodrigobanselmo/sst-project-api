import { AbsenteeismMetricsDAO } from '@/@v2/enterprise/absenteeism/database/dao/absenteeism-metrics/absenteeism-metrics.dao';
import { Injectable } from '@nestjs/common';
import { IAbsenteeismUseCase } from './read-absenteeism.types';

@Injectable()
export class ReadAbsenteeismMotiveCountUseCase {
  constructor(private readonly absenteeismMetricsDAO: AbsenteeismMetricsDAO) {}

  async execute(params: IAbsenteeismUseCase.Params) {
    const result = await this.absenteeismMetricsDAO.readMotiveCount({
      companyId: params.companyId,
      workspacesIds: params.workspacesIds,
      endDate: params.endDate,
      hierarchiesIds: params.hierarchiesIds,
      motivesIds: params.motivesIds,
      startDate: params.startDate,
    });

    return result;
  }
}
