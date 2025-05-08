import { Injectable } from '@nestjs/common';
import { IBrowseTaskProjectUseCase } from './browse-task-project.types';
import { TaskProjectDAO } from '@/@v2/task/database/dao/task-project/task-project.dao';

@Injectable()
export class BrowseTaskProjectUseCase {
  constructor(private readonly taskDAO: TaskProjectDAO) {}

  async execute(params: IBrowseTaskProjectUseCase.Params) {
    return await this.taskDAO.browse({
      page: params.pagination.page,
      limit: params.pagination.limit,
      orderBy: params.orderBy,
      filters: {
        companyId: params.companyId,
        search: params.search,
        membersIds: params.membersIds,
      },
    });
  }
}
