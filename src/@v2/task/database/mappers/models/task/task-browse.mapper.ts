import { IPaginationModelMapper, PaginationModelMapper } from '@/@v2/shared/utils/database/pagination-mapper';
import { TaskBrowseFilterModelMapper, ITaskBrowseFilterModelMapper } from './task-browse-filter.mapper';
import { TaskBrowseResultModelMapper, ITaskBrowseResultModelMapper } from './task-browse-result.mapper';
import { TaskBrowseModel } from '@/@v2/task/domain/models/task/task-browse.model';

export type ITaskBrowseModelMapper = {
  results: ITaskBrowseResultModelMapper[];
  pagination: IPaginationModelMapper;
  filters: ITaskBrowseFilterModelMapper;
};

export class TaskBrowseModelMapper {
  static toModel(prisma: ITaskBrowseModelMapper): TaskBrowseModel {
    return new TaskBrowseModel({
      results: TaskBrowseResultModelMapper.toModels(prisma.results),
      pagination: PaginationModelMapper.toModel(prisma.pagination),
      filters: TaskBrowseFilterModelMapper.toModel(prisma.filters),
    });
  }
}
