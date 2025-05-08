import { LocalContext, UserContext } from '@/@v2/shared/adapters/context';
import { ContextKey } from '@/@v2/shared/adapters/context/types/enum/context-key.enum';
import { SharedTokens } from '@/@v2/shared/constants/tokens';
import { TaskAggregateRepository } from '@/@v2/task/database/repositories/task/task-aggregate.repository';
import { CreateTaskPhotosService } from '@/@v2/task/services/create-task-photos/create-task-photos.service';
import { Inject, Injectable } from '@nestjs/common';
import { TaskAggregate } from '../../domain/aggregations/task.aggregate';
import { IEditTaskService } from './edit-task.service.types';

@Injectable()
export class EditTaskService {
  constructor(
    @Inject(SharedTokens.Context)
    private readonly context: LocalContext,
    private readonly taskRepository: TaskAggregateRepository,
    private readonly createTaskPhotosService: CreateTaskPhotosService,
  ) {}

  async update(params: IEditTaskService.Params) {
    const loggedUser = this.context.get<UserContext>(ContextKey.USER);

    const task = await this.taskRepository.find({ id: params.id, companyId: params.companyId });
    if (!task) return null;

    if (!!task.photos?.length) {
      await this.updateTaskPhotos({ params, task, loggedUser });
    }

    task.update({
      userId: loggedUser.id,
      endDate: params.endDate,
      statusId: params.statusId,
      doneDate: params.doneDate,
      description: params.description,
      responsible: params.responsible,
      priority: params.priority,
    });

    return task;
  }

  private async updateTaskPhotos({ params, task, loggedUser }: { params: IEditTaskService.Params; task: TaskAggregate; loggedUser: UserContext }) {
    const addPhotos = [] as { fileId: string }[];
    const deletePhotos = [] as number[];

    params.photos?.forEach((photo) => {
      if (photo.fileId && !photo.id) {
        addPhotos.push({ fileId: photo.fileId });
      }

      if (photo.id && photo.delete) {
        deletePhotos.push(photo.id);
      }
    });

    const photos = await this.createTaskPhotosService.create({
      companyId: params.companyId,
      photos: addPhotos,
    });

    task.addPhotos({
      userId: loggedUser.id,
      photos,
    });

    task.removePhotos({
      userId: loggedUser.id,
      photoIds: deletePhotos,
    });
  }
}
