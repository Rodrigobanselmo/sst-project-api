import { TaskProjectStatusEnum } from '@/@v2/task/domain/enums/task-project-status.enum';
import { TaskProjectReadModel } from '@/@v2/task/domain/models/task-project/task-project-read.model';
import { TaskProject, User } from '@prisma/client';

export type ITaskProjectReadModelMapper = TaskProject & {
  user: Pick<User, 'id' | 'name' | 'email'>;
  members: { user: Pick<User, 'id' | 'name' | 'email'> }[];
};

export class TaskProjectReadModelMapper {
  static toModel(prisma: ITaskProjectReadModelMapper): TaskProjectReadModel {
    return new TaskProjectReadModel({
      id: prisma.id,
      name: prisma.name,
      createdAt: prisma.created_at,
      updatedAt: prisma.updated_at,
      description: prisma.description,
      status: prisma.status as TaskProjectStatusEnum,
      creator: {
        id: prisma.user.id,
        name: prisma.user.name!,
        email: prisma.user.email!,
      },
      members: prisma.members.map((member) => ({
        id: member.user.id,
        name: member.user.name!,
        email: member.user.email!,
      })),
    });
  }

  static toModels(prisma: ITaskProjectReadModelMapper[]): TaskProjectReadModel[] {
    return prisma.map((rec) => TaskProjectReadModelMapper.toModel(rec));
  }
}
