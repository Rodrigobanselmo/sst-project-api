import { TaskProjectBrowseFilterModel } from '@/@v2/task/domain/models/task-project/task-project-browse-filter.model';

export type ITaskProjectBrowseFilterModelMapper = {};

export class TaskProjectBrowseFilterModelMapper {
  static toModel(): TaskProjectBrowseFilterModel {
    return new TaskProjectBrowseFilterModel();
  }
}
