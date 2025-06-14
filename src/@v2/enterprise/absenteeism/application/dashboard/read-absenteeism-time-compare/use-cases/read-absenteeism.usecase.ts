import { AbsenteeismMetricsDAO } from '@/@v2/enterprise/absenteeism/database/dao/absenteeism-metrics/absenteeism-metrics.dao';
import { Injectable } from '@nestjs/common';
import { IAbsenteeismUseCase } from './read-absenteeism.types';
import { AbsenteeismHierarchyTypeEnum } from '@/@v2/enterprise/absenteeism/domain/enums/absenteeism-hierarchy-type';
import { getPreviousDateRanges } from '@/@v2/enterprise/absenteeism/utils/get-previous-date-ranges';
import { asyncEach } from '@/@v2/shared/utils/helpers/async-each';

@Injectable()
export class ReadAbsenteeismHierarchyTimeCompareUseCase {
  constructor(private readonly absenteeismMetricsDAO: AbsenteeismMetricsDAO) {}

  async execute(params: IAbsenteeismUseCase.Params) {
    if (!params.items || params.items.length === 0) {
      return [];
    }

    const items = await asyncEach(params.items, async (item) => await this.getItem(params, item));

    return items;
  }

  private async getItem(params: IAbsenteeismUseCase.Params, item: IAbsenteeismUseCase.Params['items'][0]) {
    const hierarchiesIds = [];
    const workspacesIds = [];
    const homogeneousGroupsIds = [];

    if (item.type === AbsenteeismHierarchyTypeEnum.WORKSPACE) {
      workspacesIds.push(item.id);
    } else if (item.type === AbsenteeismHierarchyTypeEnum.HOMOGENEOUS_GROUP) {
      homogeneousGroupsIds.push(item.id);
    } else {
      hierarchiesIds.push(item.id);
    }

    const ranges = getPreviousDateRanges(params.range, 7);

    const promises = ranges.map(async (range) => {
      const result = await this.absenteeismMetricsDAO.browseHierarchyTotal({
        page: 1,
        limit: 1,
        filters: {
          type: item.type,
          companyId: params.companyId,
          workspacesIds: workspacesIds,
          hierarchiesIds: hierarchiesIds,
          homogeneousGroupsIds: homogeneousGroupsIds,
          endDate: range.endDate,
          startDate: range.startDate,
        },
      });

      return {
        result: result.results[0],
        startDate: range.startDate,
        endDate: range.endDate,
      };
    });

    const results = await Promise.all(promises);

    return results
      .filter((result) => result.result?.[item.type])
      .map((result) => {
        const record = result.result[item.type];

        return {
          id: record.id,
          name: record.name,
          startDate: result.startDate,
          endDate: result.endDate,

          total: result.result.total,
          totalDays: result.result.totalDays,
          averageDays: result.result.averageDays,
        };
      });
  }
}
