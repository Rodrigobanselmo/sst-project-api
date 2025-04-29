export type ITaskBrowseFilterModel = {
  status: { id: number; name: string; color?: string }[];
};

export class TaskBrowseFilterModel {
  status: { id: number; name: string; color?: string }[];

  constructor(params: ITaskBrowseFilterModel) {
    this.status = params.status;
  }
}
