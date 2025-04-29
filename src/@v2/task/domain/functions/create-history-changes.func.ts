import { TaskAggregate } from '../aggregations/task.aggregate';
import { TaskPhotoEntity } from '../entities/task-photo.entity';
import { TaskResponsibleEntity } from '../entities/task-responsible.entity';
import { TaskHistoryChangeEnum } from '../enums/task-history-changes.enum';
import { ITaskHistoryChanges } from '../types/task-history-changes.type';

type Props = {
  endDate?: Date | null;
  statusId?: number | null;
  doneDate?: Date | null;
  description?: string;
  responsible?: TaskResponsibleEntity[];
  photos?: TaskPhotoEntity[];
};

export function createHistoryChanges(oldParams: TaskAggregate, newParams: Props): ITaskHistoryChanges {
  const diffs: ITaskHistoryChanges = {};

  if (newParams.statusId != undefined && newParams.statusId !== oldParams.task.statusId) {
    diffs[TaskHistoryChangeEnum.STATUS] = {
      old: oldParams.task.statusId,
      new: newParams.statusId,
    };
  }

  if (newParams.endDate != undefined && newParams.endDate !== oldParams.task.endDate) {
    diffs[TaskHistoryChangeEnum.END_DATE] = {
      old: oldParams.task.endDate,
      new: newParams.endDate,
    };
  }

  if (newParams.doneDate != undefined && newParams.doneDate !== oldParams.task.doneDate) {
    diffs[TaskHistoryChangeEnum.DONE_DATE] = {
      old: oldParams.task.doneDate,
      new: newParams.doneDate,
    };
  }

  if (newParams.description != undefined && newParams.description !== oldParams.task.description) {
    diffs[TaskHistoryChangeEnum.DESCRIPTION] = {
      old: oldParams.task.description,
      new: newParams.description,
    };
  }

  if (newParams.responsible) {
    const oldResponsibleIds = oldParams.responsible.map((responsible) => responsible.userId);
    const newResponsibleIds = newParams.responsible.map((responsible) => responsible.userId);

    const oldSorted = [...oldResponsibleIds].sort();
    const newSorted = [...newResponsibleIds].sort();

    const areDifferent = oldSorted.length !== newSorted.length || oldSorted.some((id, index) => id !== newSorted[index]);

    if (areDifferent) {
      diffs[TaskHistoryChangeEnum.RESPONSIBLE] = {
        old: oldResponsibleIds,
        new: newResponsibleIds,
      };
    }
  }

  if (newParams.photos) {
    const oldPhotosIds = oldParams.photos.map((photos) => photos.fileId);
    const newPhotosIds = newParams.photos.map((photos) => photos.fileId);

    const oldSorted = [...oldPhotosIds].sort();
    const newSorted = [...newPhotosIds].sort();

    const areDifferent = oldSorted.length !== newSorted.length || oldSorted.some((id, index) => id !== newSorted[index]);

    if (areDifferent) {
      diffs[TaskHistoryChangeEnum.PHOTO] = {
        old: oldPhotosIds,
        new: newPhotosIds,
      };
    }
  }

  return diffs;
}
