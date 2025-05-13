import { Injectable } from '@nestjs/common';
import { TaskDAO } from '@/@v2/task/database/dao/task/task.dao';
import { IReadTaskUseCase } from './read-task.types';

@Injectable()
export class ReadTaskUseCase {
  constructor(private readonly taskDAO: TaskDAO) {}

  async execute(params: IReadTaskUseCase.Params) {
    return await this.taskDAO.read({
      companyId: params.companyId,
      id: params.id,
    });
  }
}
