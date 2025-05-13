import { UserContext } from '@/@v2/shared/adapters/context';
import nodeContext from '@/@v2/shared/adapters/context/lib/node.context';
import { ContextKey } from '@/@v2/shared/adapters/context/types/enum/context-key.enum';
import { TaskProjectStatusEnum } from '@/@v2/task/domain/enums/task-project-status.enum';
import { TaskProjectBrowseResultModel } from '@/@v2/task/domain/models/task-project/task-project-browse-result.model';
import { StatusEnum } from '@prisma/client';

export type ITaskProjectBrowseResultModelMapper = {
  task_project_id: number;
  task_project_name: string;
  task_project_description: string;
  task_project_status: StatusEnum;
  task_project_created_at: Date;
  task_project_updated_at: Date;
  task_project_members: number[] | null;
  creator_user_id: number;
};

export class TaskProjectBrowseResultModelMapper {
  static toModel(prisma: ITaskProjectBrowseResultModelMapper): TaskProjectBrowseResultModel {
    const loggedUser = nodeContext.get<UserContext>(ContextKey.USER);

    return new TaskProjectBrowseResultModel({
      id: prisma.task_project_id,
      name: prisma.task_project_name,
      status: TaskProjectStatusEnum[prisma.task_project_status],
      createdAt: prisma.task_project_created_at,
      description: prisma.task_project_description,
      updatedAt: prisma.task_project_updated_at,
      isMember: [...(prisma?.task_project_members || []), prisma.creator_user_id].includes(loggedUser.id),
    });
  }

  static toModels(prisma: ITaskProjectBrowseResultModelMapper[]): TaskProjectBrowseResultModel[] {
    return prisma.map((rec) => TaskProjectBrowseResultModelMapper.toModel(rec));
  }
}
