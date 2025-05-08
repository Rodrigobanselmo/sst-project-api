import { TaskProjectMemberEntity } from '@/@v2/task/domain/entities/task-project-member.entity';
import { TaskProjectMembers } from '@prisma/client';

export type ITaskProjectMemberEntityMapper = TaskProjectMembers;

export class TaskProjectMemberMapper {
  static toEntity(data: ITaskProjectMemberEntityMapper): TaskProjectMemberEntity {
    return new TaskProjectMemberEntity({
      createdAt: data.created_at,
      deletedAt: data.deleted_at,
      updatedAt: data.updated_at,
      id: data.id,
      userId: data.user_id,
    });
  }

  static toEntities(data: ITaskProjectMemberEntityMapper[]): TaskProjectMemberEntity[] {
    return data.map((item) => this.toEntity(item));
  }
}
