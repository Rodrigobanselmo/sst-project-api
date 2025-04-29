import { TaskBrowseFilterModel } from '@/@v2/task/domain/models/task/task-browse-filter.model';
import { CharacterizationTypeEnum as PrismaCharacterizationTypeEnum, Status as PrismaStatus } from '@prisma/client';

export type ITaskBrowseFilterModelMapper = {
  status: (PrismaStatus | null)[] | null;
};

export class TaskBrowseFilterModelMapper {
  static toModel(prisma: ITaskBrowseFilterModelMapper): TaskBrowseFilterModel {
    return new TaskBrowseFilterModel({
      status:
        prisma.status?.map((stage) => {
          if (!stage)
            return {
              id: 0,
              name: 'Sem Status',
              color: undefined,
            };

          return {
            id: stage.id,
            name: stage.name,
            color: stage.color || undefined,
          };
        }) || [],
    });
  }
}
