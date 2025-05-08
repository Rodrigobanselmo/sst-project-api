import { DomainResponse } from '@/@v2/shared/domain/types/shared/domain-response';
import { TaskProjectMemberEntity } from '../entities/task-project-member.entity';
import { TaskProjectEntity } from '../entities/task-project.entity';
import { TaskProjectStatusEnum } from '../enums/task-project-status.enum';
import { errorTaskMemberAlreadyExist, errorTaskMemberCantRemoveIsAdmin } from '../errors/task.errors';

type IUpdateTaskProjectParams = {
  name?: string;
  description?: string | null;
  status?: TaskProjectStatusEnum;
};

export type ITaskProjectAggregate = {
  project: TaskProjectEntity;
  members: TaskProjectMemberEntity[];
};

export class TaskProjectAggregate {
  private _project: TaskProjectEntity;
  private _members: TaskProjectMemberEntity[];

  constructor(params: ITaskProjectAggregate) {
    this._project = params.project;
    this._members = params.members;
  }

  get project(): TaskProjectEntity {
    return this._project;
  }

  get members(): TaskProjectMemberEntity[] {
    return this._members;
  }

  update(data: IUpdateTaskProjectParams) {
    this.project.update(data);
  }

  addMember(member: TaskProjectMemberEntity): DomainResponse {
    const isMember = this._members.some((member) => member.userId === member.userId);
    const isMemberAdmin = member.userId === this._project.userId;
    if (isMember || isMemberAdmin) return [, errorTaskMemberAlreadyExist];

    this._members = [...this._members, member];

    return [, null];
  }

  removeMember(member: TaskProjectMemberEntity): DomainResponse {
    const isMemberAdmin = member.userId === this._project.userId;
    if (isMemberAdmin) return [, errorTaskMemberCantRemoveIsAdmin];

    this._members = this._members.filter((m) => m.userId !== member.userId);

    return [, null];
  }
}
