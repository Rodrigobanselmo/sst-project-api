import { BadRequestException, Injectable } from '@nestjs/common';
import { ITaskProjectUseCase } from './delete-task-project.types';
import { TaskProjectAggregateRepository } from '@/@v2/task/database/repositories/task-project/task-project-aggregate.repository';

@Injectable()
export class DeleteTaskProjectUseCase {
  constructor(private readonly taskRepository: TaskProjectAggregateRepository) {}

  async execute(params: ITaskProjectUseCase.Params) {
    const task = await this.taskRepository.find({ id: params.id, companyId: params.companyId });
    if (!task) throw new BadRequestException('Item não encontrado');

    task.project.delete();

    await this.taskRepository.update(task);
  }
}
