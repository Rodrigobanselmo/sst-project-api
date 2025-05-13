import { Injectable } from '@nestjs/common';
import { IReadTaskProjectUseCase } from './read-task-project.types';
import { TaskProjectDAO } from '@/@v2/task/database/dao/task-project/task-project.dao';

@Injectable()
export class ReadTaskProjectUseCase {
  constructor(private readonly taskDAO: TaskProjectDAO) {}

  async execute(params: IReadTaskProjectUseCase.Params) {
    return await this.taskDAO.read({
      companyId: params.companyId,
      id: params.id,
    });
  }
}
