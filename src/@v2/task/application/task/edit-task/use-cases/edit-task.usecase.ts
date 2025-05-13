import { TaskAggregateRepository } from '@/@v2/task/database/repositories/task/task-aggregate.repository';
import { EditTaskService } from '@/@v2/task/services/edit-task/edit-task.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ITaskUseCase } from './edit-task.types';

@Injectable()
export class EditTaskUseCase {
  constructor(
    private readonly taskRepository: TaskAggregateRepository,
    private readonly editTaskService: EditTaskService,
  ) {}

  async execute(params: ITaskUseCase.Params) {
    const task = await this.editTaskService.update(params);
    if (!task) throw new BadRequestException('Item não encontrado');

    await this.taskRepository.update(task);
  }
}
