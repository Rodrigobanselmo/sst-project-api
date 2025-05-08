import { TaskProjectStatusEnum } from '../../enums/task-project-status.enum';

export type ITaskProjectReadModel = {
  id: number;
  name: string;
  description?: string | null;
  status: TaskProjectStatusEnum;
  createdAt?: Date;
  updatedAt?: Date;

  creator: { id: number; name: string; email: string };
  members: { id: number; name: string; email: string }[];
};

export class TaskProjectReadModel {
  id: number;
  name: string;
  description?: string | null;
  status: TaskProjectStatusEnum;
  createdAt?: Date;
  updatedAt?: Date;

  creator: { id: number; name: string; email: string };
  members: { id: number; name: string; email: string }[];

  constructor(params: ITaskProjectReadModel) {
    this.id = params.id;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
    this.description = params.description;
    this.name = params.name;
    this.status = params.status;

    this.creator = params.creator;
    this.members = params.members;
  }
}
