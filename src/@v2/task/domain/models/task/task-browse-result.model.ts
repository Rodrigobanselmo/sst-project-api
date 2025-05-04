export type ITaskBrowseResultModel = {
  id: number;
  description: string;
  createdAt: Date;
  updatedAt: Date | null;
  priority: number;

  parent: { name: string; id: number } | null;
  status: { name: string; color: string | null } | null;
  createdBy: { id: number; name: string; email: string };
  responsible: { id: number; name: string; email: string }[];
};

export class TaskBrowseResultModel {
  id: number;
  description: string;
  createdAt: Date;
  updatedAt: Date | null;
  priority: number;

  parent: { name: string; id: number } | null;
  status: { name: string; color: string | null } | null;
  createdBy: { id: number; name: string; email: string };
  responsible: { id: number; name: string; email: string }[];

  constructor(params: ITaskBrowseResultModel) {
    this.id = params.id;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
    this.description = params.description;
    this.priority = params.priority;

    this.parent = params.parent;
    this.status = params.status;
    this.createdBy = params.createdBy;
    this.responsible = params.responsible;
  }
}
