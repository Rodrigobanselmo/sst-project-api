import { asyncBatch } from '@/@v2/shared/utils/helpers/async-batch';
import { TaskAggregateRepository } from '@/@v2/task/database/repositories/task/task-aggregate.repository';
import { EditTaskService } from '@/@v2/task/services/edit-task/edit-task.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ITaskUseCase } from './edit-many-task.types';

@Injectable()
export class EditManyTaskUseCase {
  constructor(
    private readonly editTaskService: EditTaskService,
    private readonly taskRepository: TaskAggregateRepository,
  ) {}

  async execute(params: ITaskUseCase.Params) {
    const tasks = await asyncBatch({
      items: params.ids,
      batchSize: 10,
      callback: async (id) => {
        const task = await this.editTaskService.update({
          id,
          photos: undefined,
          ...params,
        });

        if (!task) throw new BadRequestException('Item não encontrado');
        return task;
      },
    });

    await this.taskRepository.updateMany(tasks);
  }
}
