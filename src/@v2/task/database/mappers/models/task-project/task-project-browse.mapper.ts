import { IPaginationModelMapper, PaginationModelMapper } from '@/@v2/shared/utils/database/pagination-mapper';
import { TaskProjectBrowseModel } from '@/@v2/task/domain/models/task-project/task-project-browse.model';
import { TaskProjectBrowseFilterModelMapper } from './task-project-browse-filter.mapper';
import { ITaskProjectBrowseResultModelMapper, TaskProjectBrowseResultModelMapper } from './task-project-browse-result.mapper';

export type ITaskProjectBrowseModelMapper = {
  results: ITaskProjectBrowseResultModelMapper[];
  pagination: IPaginationModelMapper;
};

export class TaskProjectBrowseModelMapper {
  static toModel(prisma: ITaskProjectBrowseModelMapper): TaskProjectBrowseModel {
    return new TaskProjectBrowseModel({
      results: TaskProjectBrowseResultModelMapper.toModels(prisma.results),
      pagination: PaginationModelMapper.toModel(prisma.pagination),
      filters: TaskProjectBrowseFilterModelMapper.toModel(),
    });
  }
}
