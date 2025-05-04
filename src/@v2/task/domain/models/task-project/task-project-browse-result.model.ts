import { TaskProjectStatusEnum } from '../../enums/task-project-status.enum';

export type ITaskProjectBrowseResultModel = {
  id: number;
  name: string;
  description?: string | null;
  status: TaskProjectStatusEnum;
  createdAt?: Date;
  updatedAt?: Date;
  isMember: boolean;
};

export class TaskProjectBrowseResultModel {
  id: number;
  name: string;
  description?: string | null;
  status: TaskProjectStatusEnum;
  createdAt?: Date;
  updatedAt?: Date;
  isMember: boolean;

  constructor(params: ITaskProjectBrowseResultModel) {
    this.id = params.id;
    this.name = params.name;
    this.description = params.description;
    this.status = params.status;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
    this.isMember = params.isMember;
  }
}
