import { TaskResponsibleEntity } from '@/@v2/task/domain/entities/task-responsible.entity';
import { TaskResponsible } from '@prisma/client';

export type ITaskResponsibleEntityMapper = TaskResponsible;

export class TaskResponsibleMapper {
  static toEntity(data: ITaskResponsibleEntityMapper): TaskResponsibleEntity {
    return new TaskResponsibleEntity({
      userId: data.user_id,
    });
  }

  static toEntities(data: ITaskResponsibleEntityMapper[]): TaskResponsibleEntity[] {
    return data.map((item) => this.toEntity(item));
  }
}
