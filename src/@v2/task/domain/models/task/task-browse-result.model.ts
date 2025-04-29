export type ITaskBrowseResultModel = {
  id: string;
  description: string;
  createdAt: Date;
  updatedAt: Date | null;

  status: { name: string; color: string | null } | null;
  createdBy: { id: number; name: string; email: string };
  responsible: { id: number; name: string; email: string };
};

export class TaskBrowseResultModel {
  id: string;
  description: string;
  createdAt: Date;
  updatedAt: Date | null;

  status: { name: string; color: string | null } | null;
  createdBy: { id: number; name: string; email: string };
  responsible: { id: number; name: string; email: string };

  constructor(params: ITaskBrowseResultModel) {
    this.id = params.id;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
    this.description = params.description;

    this.status = params.status;
    this.createdBy = params.createdBy;
    this.responsible = params.responsible;
  }
}
