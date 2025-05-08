import { BadRequestException, Injectable } from '@nestjs/common';
import { ITaskUseCase } from './delete-task.types';
import { TaskAggregateRepository } from '@/@v2/task/database/repositories/task/task-aggregate.repository';

@Injectable()
export class DeleteTaskUseCase {
  constructor(private readonly taskRepository: TaskAggregateRepository) {}

  async execute(params: ITaskUseCase.Params) {
    const task = await this.taskRepository.find({ id: params.id, companyId: params.companyId });
    if (!task) throw new BadRequestException('Item não encontrado');

    task.task.delete();

    await this.taskRepository.update(task);
  }
}
