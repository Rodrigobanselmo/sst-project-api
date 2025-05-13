import { TaskReadModel } from '@/@v2/task/domain/models/task/task-read.model';
import { ITaskHistoryChanges } from '@/@v2/task/domain/types/task-history-changes.type';
import { Status, Task, TaskHistory, User } from '@prisma/client';

export type ITaskReadModelMapper = Task & {
  creator: Pick<User, 'id' | 'name' | 'email'>;
  responsible: {
    user: Pick<User, 'id' | 'name' | 'email'>;
  }[];
  photos: { id: number; file: { url: string } }[];
  status: Status | null;
  history: (TaskHistory & {
    user: Pick<User, 'id' | 'name'>;
  })[];
  sub_tasks: (Task & {
    responsible: {
      user: Pick<User, 'id' | 'name' | 'email'>;
    }[];
    status: Status | null;
  })[];
  parent_task: { id: number; description: string } | null;
};

export class TaskReadModelMapper {
  static toModel(prisma: ITaskReadModelMapper): TaskReadModel {
    return new TaskReadModel({
      id: prisma.id,
      sequentialId: prisma.sequential_id,
      companyId: prisma.company_id,
      createdAt: prisma.created_at,
      updatedAt: prisma.updated_at,
      description: prisma.description,
      priority: prisma.priority,
      doneDate: prisma.done_date || undefined,
      endDate: prisma.end_date || undefined,
      parent: prisma.parent_task,
      history: prisma.history.map((history) => ({
        id: history.id,
        text: history.text || undefined,
        changes: (history.changes as ITaskHistoryChanges) || undefined,
        createdAt: history.created_at,
        user: {
          id: history.user.id,
          name: history.user.name!,
        },
      })),
      photos: prisma.photos.map((photo) => ({
        id: photo.id,
        url: photo.file.url,
      })),
      subTasks: prisma.sub_tasks.map((subTask) => ({
        id: subTask.id,
        sequentialId: subTask.sequential_id,
        description: subTask.description,
        priority: subTask.priority,
        endDate: subTask.end_date || undefined,
        doneDate: subTask.done_date || undefined,
        status: subTask.status
          ? {
              name: subTask.status.name,
              color: subTask.status.color || undefined,
              id: subTask.status.id,
            }
          : undefined,
        responsible: subTask.responsible.map((resp) => ({
          name: resp.user.name!,
          email: resp.user.email!,
          id: resp.user.id,
        })),
      })),
      createdBy: {
        name: prisma.creator.name!,
        email: prisma.creator.email!,
        id: prisma.creator.id,
      },
      responsible: prisma.responsible
        ? prisma.responsible.map((resp) => ({
            name: resp.user.name!,
            email: resp.user.email!,
            id: resp.user.id,
          }))
        : [],
      status: prisma.status
        ? {
            name: prisma.status.name,
            color: prisma.status.color || undefined,
            id: prisma.status.id,
          }
        : undefined,
    });
  }

  static toModels(prisma: ITaskReadModelMapper[]): TaskReadModel[] {
    return prisma.map((rec) => TaskReadModelMapper.toModel(rec));
  }
}
