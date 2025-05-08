import { TaskBrowseResultModel } from '@/@v2/task/domain/models/task/task-browse-result.model';

export type ITaskBrowseResultModelMapper = {
  task_id: number;
  task_sequential_id: number;
  task_done_date: Date | null;
  task_end_date: Date | null;
  task_description: string;
  task_created_at: Date;
  task_updated_at: Date | null;
  task_priority: number;

  responsible: {
    id: number;
    name: string;
    email: string;
  }[];

  parent: {
    id: number;
    description: string;
  };

  creator_user: {
    id: number;
    name: string;
    email: string;
  };

  status: {
    name: string;
    color: string | null;
  } | null;
};

export class TaskBrowseResultModelMapper {
  static toModel(prisma: ITaskBrowseResultModelMapper): TaskBrowseResultModel {
    return new TaskBrowseResultModel({
      id: prisma.task_id,
      sequentialId: prisma.task_sequential_id,
      createdAt: prisma.task_created_at,
      updatedAt: prisma.task_updated_at,
      description: prisma.task_description,
      priority: prisma.task_priority,
      endDate: prisma.task_end_date,
      doneDate: prisma.task_done_date,
      parent: prisma.parent
        ? {
            id: prisma.parent.id,
            name: prisma.parent.description,
          }
        : undefined,
      createdBy: {
        name: prisma.creator_user.name,
        email: prisma.creator_user.email,
        id: prisma.creator_user.id,
      },
      responsible: prisma.responsible
        ? prisma.responsible.map((resp) => ({
            name: resp.name!,
            email: resp.email!,
            id: resp.id,
          }))
        : [],
      status: prisma.status
        ? {
            name: prisma.status.name,
            color: prisma.status.color || undefined,
          }
        : undefined,
    });
  }

  static toModels(prisma: ITaskBrowseResultModelMapper[]): TaskBrowseResultModel[] {
    return prisma.map((rec) => TaskBrowseResultModelMapper.toModel(rec));
  }
}
