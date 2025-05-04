import { TaskAggregate } from '@/@v2/task/domain/aggregations/task.aggregate';
import { ITaskActionPlanEntityMapper, TaskActionPlanMapper } from '../entities/task-action-plan.mapper';
import { ITaskHistoryEntityMapper, TaskHistoryMapper } from '../entities/task-history.mapper';
import { ITaskPhotosEntityMapper, TaskPhotosMapper } from '../entities/task-photos.mapper';
import { ITaskProjectEntityMapper, TaskProjectMapper } from '../entities/task-project.mapper';
import { ITaskResponsibleEntityMapper, TaskResponsibleMapper } from '../entities/task-responsible.mapper';
import { ITaskEntityMapper, TaskMapper } from '../entities/task.mapper';

type ITaskAggregateMapper = ITaskEntityMapper & {
  action_plan: ITaskActionPlanEntityMapper | null;
  history: ITaskHistoryEntityMapper[];
  project: ITaskProjectEntityMapper | null;
  responsible: ITaskResponsibleEntityMapper[];
  photos: ITaskPhotosEntityMapper[];
};

export class TaskAggregateMapper {
  static toAggregate(data: ITaskAggregateMapper): TaskAggregate {
    return new TaskAggregate({
      history: TaskHistoryMapper.toEntities(data.history),
      actionPlan: data.action_plan ? TaskActionPlanMapper.toEntity(data.action_plan) : null,
      task: TaskMapper.toEntity(data),
      project: data.project ? TaskProjectMapper.toEntity(data.project) : null,
      responsible: TaskResponsibleMapper.toEntities(data.responsible),
      photos: TaskPhotosMapper.toEntities(data.photos),
    });
  }
}
