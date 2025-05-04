import { ITaskHistoryChanges } from '../../types/task-history-changes.type';

export type ISubTaskReadModel = {
  id: number;
  description: string;
  priority: number;
  endDate?: Date;
  doneDate?: Date;

  status?: { name: string; color?: string };
  responsible: { id: number; name: string; email: string }[];
};

export type ITaskReadModel = {
  id: number;
  description: string;
  priority: number;
  endDate?: Date;
  doneDate?: Date;
  createdAt: Date;
  updatedAt?: Date;

  status?: { name: string; color?: string };
  createdBy: { id: number; name: string; email: string };
  responsible: { id: number; name: string; email: string }[];
  history: { id: number; text?: string; changes?: ITaskHistoryChanges; createdAt: Date; user: { id: number; name: string } }[];
  photos: { id: number; url: string }[];
  subTasks: ISubTaskReadModel[];
  parent: { id: number; description: string } | null;
};

export class TaskReadModel {
  id: number;
  description: string;
  endDate?: Date;
  doneDate?: Date;
  createdAt: Date;
  updatedAt?: Date;
  priority: number;

  status?: { name: string; color?: string };
  createdBy: { id: number; name: string; email: string };
  responsible: { id: number; name: string; email: string }[];
  history: { id: number; text?: string; changes?: ITaskHistoryChanges; createdAt: Date; user: { id: number; name: string } }[];
  photos: { id: number; url: string }[];
  subTasks: ISubTaskReadModel[];
  parent: { id: number; description: string } | null;

  constructor(params: ITaskReadModel) {
    this.id = params.id;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
    this.description = params.description;
    this.endDate = params.endDate;
    this.doneDate = params.doneDate;
    this.priority = params.priority;

    this.status = params.status;
    this.createdBy = params.createdBy;
    this.responsible = params.responsible;
    this.history = params.history;
    this.photos = params.photos;
    this.subTasks = params.subTasks;
    this.parent = params.parent;
  }
}
