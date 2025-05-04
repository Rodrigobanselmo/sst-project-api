import { TaskProjectAggregate } from '@/@v2/task/domain/aggregations/task-project.aggregate';
import { ITaskProjectMemberEntityMapper, TaskProjectMemberMapper } from '../entities/task-project-member.mapper';
import { ITaskProjectEntityMapper, TaskProjectMapper } from '../entities/task-project.mapper';

type ITaskProjectAggregateMapper = ITaskProjectEntityMapper & {
  members: ITaskProjectMemberEntityMapper[];
};

export class TaskProjectAggregateMapper {
  static toAggregate(data: ITaskProjectAggregateMapper): TaskProjectAggregate {
    return new TaskProjectAggregate({
      project: TaskProjectMapper.toEntity(data),
      members: TaskProjectMemberMapper.toEntities(data.members),
    });
  }
}
