import { TaskHistoryChangeEnum } from '../enums/task-history-changes.enum';

type ITaskHistoryChangesDescription = {
  [TaskHistoryChangeEnum.DESCRIPTION]: {
    old: string | null;
    new: string | null;
  };
};

type ITaskHistoryChangesStatus = {
  [TaskHistoryChangeEnum.STATUS]: {
    old: number | null;
    new: number | null;
  };
};

type ITaskHistoryChangesResponsible = {
  [TaskHistoryChangeEnum.RESPONSIBLE]: {
    old: number[];
    new: number[];
  };
};

type ITaskHistoryChangesEndDate = {
  [TaskHistoryChangeEnum.END_DATE]: {
    old: Date | null;
    new: Date | null;
  };
};

type ITaskHistoryChangesDoneDate = {
  [TaskHistoryChangeEnum.DONE_DATE]: {
    old: Date | null;
    new: Date | null;
  };
};

type ITaskHistoryChangesPhoto = {
  [TaskHistoryChangeEnum.PHOTO]: {
    old: string[];
    new: string[];
  };
};

export type ITaskHistoryChanges = Partial<
  ITaskHistoryChangesDescription & ITaskHistoryChangesStatus & ITaskHistoryChangesResponsible & ITaskHistoryChangesEndDate & ITaskHistoryChangesDoneDate & ITaskHistoryChangesPhoto
>;
