import { updateField } from '@/@v2/shared/domain/helpers/update-field.helper';
import { TaskActionPlanEntity } from '../entities/task-action-plan.entity';
import { TaskHistoryEntity } from '../entities/task-history.entity';
import { TaskProjectEntity } from '../entities/task-project.entity';
import { TaskResponsibleEntity } from '../entities/task-responsible.entity';
import { TaskEntity } from '../entities/task.entity';
import { createHistoryChanges } from '../functions/create-history-changes.func';
import { removeDuplicate } from '@/@v2/shared/utils/helpers/remove-duplicate';
import { TaskPhotoEntity } from '../entities/task-photo.entity';
import { ITaskHistoryChanges } from '../types/task-history-changes.type';

type IUpdatePhotos = {
  userId: number;
  photos: TaskPhotoEntity[];
};

type IUpdateTaskParams = {
  userId: number;
  endDate?: Date | null;
  statusId?: number | null;
  doneDate?: Date | null;
  description?: string;
  responsible?: TaskResponsibleEntity[];
};

export type ITaskAggregate = {
  task: TaskEntity;
  history: TaskHistoryEntity[];
  responsible: TaskResponsibleEntity[];
  photos: TaskPhotoEntity[];
  actionPlan?: TaskActionPlanEntity | null;
  project?: TaskProjectEntity | null;
};

export class TaskAggregate {
  private _task: TaskEntity;
  private _history: TaskHistoryEntity[];
  private _project: TaskProjectEntity | null;
  private _actionPlan: TaskActionPlanEntity | null;
  private _responsible: TaskResponsibleEntity[];
  private _photos: TaskPhotoEntity[];

  constructor(params: ITaskAggregate) {
    if (!params.actionPlan && !params.project) {
      throw new Error('Task must have a project or action plan');
    }

    this._task = params.task;
    this._project = params.project || null;
    this._actionPlan = params.actionPlan || null;
    this._history = params.history || [];
    this._responsible = params.responsible || [];
    this._photos = params.photos || [];
  }

  get task() {
    return this._task;
  }

  get history() {
    return this._history;
  }

  get project() {
    return this._project;
  }

  get actionPlan() {
    return this._actionPlan;
  }

  get responsible() {
    return removeDuplicate(this._responsible, { removeById: 'userId' });
  }

  get photos() {
    return this._photos;
  }

  update(params: IUpdateTaskParams) {
    const diffs = createHistoryChanges(this, params);

    this.addHistory({ userId: params.userId, diffs });
    this._responsible = updateField(this._responsible, params.responsible);
    this._task.update(params);
  }

  addPhotos(params: IUpdatePhotos) {
    const diffs = createHistoryChanges(this, { photos: [...this.photos, ...params.photos] });

    this.addHistory({ userId: params.userId, diffs });
    this._photos.push(...params.photos);
  }

  removePhotos(params: { userId: number; photoIds: number[] }) {
    const newPhotos = this._photos.filter((photo) => !params.photoIds.includes(photo.id));
    const diffs = createHistoryChanges(this, { photos: newPhotos });

    this.addHistory({ userId: params.userId, diffs });
    this._photos.forEach((photo) => {
      if (params.photoIds.includes(photo.id)) {
        photo.delete();
      }
    });
  }

  private addHistory(params: { userId: number; diffs: ITaskHistoryChanges }) {
    if (Object.keys(params.diffs).length > 0) {
      const historyRecord = new TaskHistoryEntity({
        userId: params.userId,
        changes: params.diffs,
      });

      this._history.push(historyRecord);
    }
  }

  is;
}
