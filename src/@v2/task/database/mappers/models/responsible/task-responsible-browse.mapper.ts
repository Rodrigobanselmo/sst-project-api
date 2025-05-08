import { IResponsibleBrowseModelMapper } from '@/@v2/security/action-plan/database/mappers/models/responsible/responsible-browse.mapper';
import { IPaginationModelMapper, PaginationModelMapper } from '@/@v2/shared/utils/database/pagination-mapper';
import { TaskResponsibleBrowseModel } from '@/@v2/task/domain/models/responsible/task-responsible-browse.model';
import { ITaskResponsibleBrowseResultModelMapper, TaskResponsibleBrowseResultModelMapper } from './task-responsible-browse-result.mapper';

export type ITaskResponsibleBrowseModelMapper = {
  results: ITaskResponsibleBrowseResultModelMapper[];
  pagination: IPaginationModelMapper;
};

export class TaskResponsibleBrowseModelMapper {
  static toModel(prisma: IResponsibleBrowseModelMapper): TaskResponsibleBrowseModel {
    return new TaskResponsibleBrowseModel({
      results: TaskResponsibleBrowseResultModelMapper.toModels(prisma.results),
      pagination: PaginationModelMapper.toModel(prisma.pagination),
    });
  }
}
