import { updateField } from '@/@v2/shared/domain/helpers/update-field.helper';

type IUpdateTaskParams = {
  endDate?: Date | null;
  statusId?: number | null;
  priority?: number;
  doneDate?: Date | null;
  description?: string;
};

export type ITaskEntity = {
  id?: number;
  description: string;
  priority?: number;
  endDate?: Date | null;
  doneDate?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
  statusId?: number | null;
  companyId: string;
  creatorId: number;
};

export class TaskEntity {
  id: number;
  description: string;
  endDate: Date | null;
  doneDate: Date | null;
  priority: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  statusId: number | null;
  companyId: string;
  creatorId: number;

  constructor(params: ITaskEntity) {
    this.id = params.id || -1;
    this.endDate = params.endDate || null;
    this.doneDate = params.doneDate || null;
    this.createdAt = params.createdAt || new Date();
    this.updatedAt = params.updatedAt || new Date();
    this.deletedAt = params.deletedAt || null;
    this.statusId = params.statusId ?? null;
    this.companyId = params.companyId;
    this.creatorId = params.creatorId;
    this.description = params.description;
    this.priority = params.priority ?? 0;
  }

  delete() {
    this.deletedAt = new Date();
  }

  update(data: IUpdateTaskParams) {
    this.statusId = updateField(this.statusId, data.statusId);
    this.endDate = updateField(this.endDate, data.endDate);
    this.doneDate = updateField(this.doneDate, data.doneDate);
    this.description = updateField(this.description, data.description);
    this.priority = updateField(this.priority, data.priority);
  }
}
