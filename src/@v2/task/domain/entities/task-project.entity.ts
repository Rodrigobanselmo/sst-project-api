import { updateField } from '@/@v2/shared/domain/helpers/update-field.helper';
import { TaskProjectStatusEnum } from '../enums/task-project-status.enum';

type IUpdateTaskProjectParams = {
  name?: string;
  description?: string | null;
  status?: TaskProjectStatusEnum;
};

export type ITaskProjectEntity = {
  id?: number;
  name: string;
  description?: string | null;
  status?: TaskProjectStatusEnum;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
  companyId: string;
  userId: number;
};

export class TaskProjectEntity {
  id: number;
  name: string;
  description: string | null;
  status: TaskProjectStatusEnum;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  companyId: string;
  userId: number;

  constructor(params: ITaskProjectEntity) {
    this.id = params.id || -1;
    this.name = params.name;
    this.description = params.description || null;
    this.status = params.status || TaskProjectStatusEnum.ACTIVE;
    this.createdAt = params.createdAt || new Date();
    this.updatedAt = params.updatedAt || new Date();
    this.deletedAt = params.deletedAt || null;
    this.companyId = params.companyId;
    this.userId = params.userId;
  }

  delete() {
    this.deletedAt = new Date();
  }

  update(data: IUpdateTaskProjectParams) {
    this.name = updateField(this.name, data.name);
    this.description = updateField(this.description, data.description);
    this.status = updateField(this.status, data.status);
  }
}
