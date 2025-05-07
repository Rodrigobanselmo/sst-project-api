export type ITaskBrowseResultModel = {
  id: number;
  sequentialId: number;
  description: string;
  createdAt: Date;
  updatedAt: Date | undefined;
  endDate: Date | undefined;
  doneDate: Date | undefined;
  priority: number;

  parent: { name: string; id: number } | undefined;
  status: { name: string; color: string | undefined } | undefined;
  createdBy: { id: number; name: string; email: string };
  responsible: { id: number; name: string; email: string }[];
};

export class TaskBrowseResultModel {
  id: number;
  sequentialId: number;
  description: string;
  createdAt: Date;
  updatedAt?: Date;
  endDate?: Date;
  doneDate?: Date;
  priority: number;

  parent?: { name: string; id: number };
  status?: { name: string; color: string | undefined };
  createdBy: { id: number; name: string; email: string };
  responsible: { id: number; name: string; email: string }[];

  constructor(params: ITaskBrowseResultModel) {
    this.id = params.id;
    this.sequentialId = params.sequentialId;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
    this.description = params.description;
    this.endDate = params.endDate;
    this.doneDate = params.doneDate;
    this.priority = params.priority;

    this.parent = params.parent;
    this.status = params.status;
    this.createdBy = params.createdBy;
    this.responsible = params.responsible;
  }
}
