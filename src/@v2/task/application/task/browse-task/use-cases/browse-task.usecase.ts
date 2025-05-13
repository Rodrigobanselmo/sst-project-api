import { Injectable } from '@nestjs/common';
import { IBrowseTaskUseCase } from './browse-task.types';
import { TaskDAO } from '@/@v2/task/database/dao/task/task.dao';

@Injectable()
export class BrowseTaskUseCase {
  constructor(private readonly taskDAO: TaskDAO) {}

  async execute(params: IBrowseTaskUseCase.Params) {
    return await this.taskDAO.browse({
      page: params.pagination.page,
      limit: params.pagination.limit,
      orderBy: params.orderBy,
      filters: {
        companyId: params.companyId,
        search: params.search,
        actionPlanIds: params.actionPlanIds,
        creatorsIds: params.creatorsIds,
        responsibleIds: params.responsibleIds,
        statusIds: params.statusIds,
        projectIds: params.projectIds,
        isExpired: params.isExpired,
        priorities: params.priorities,
      },
    });
  }
}
