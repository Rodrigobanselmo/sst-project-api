import { TaskHistoryChangeEnum } from '../enums/task-history-changes.enum';
import { ITaskHistoryChanges } from '../types/task-history-changes.type';

export type ITaskHistoryEntity = {
  id?: number;
  text?: string | null;
  changes?: ITaskHistoryChanges | null;
  createdAt?: Date;
  updatedAt?: Date;
  userId: number;
};

export class TaskHistoryEntity {
  id: number;
  text: string | null;
  changes: ITaskHistoryChanges | null;
  createdAt: Date;
  updatedAt: Date;
  userId: number;

  constructor(params: ITaskHistoryEntity) {
    this.id = params.id || -1;
    this.text = params.text || null;
    this.changes = params.changes || null;
    this.createdAt = params.createdAt || new Date();
    this.updatedAt = params.updatedAt || new Date();
    this.userId = params.userId;
  }

  get isNew(): boolean {
    return this.id === -1;
  }
}
