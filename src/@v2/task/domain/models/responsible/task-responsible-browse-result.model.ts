export type ITaskResponsibleBrowseResultModel = {
  userId?: number;
  employeeId?: number;
  email: string | undefined;
  name: string;
};

export class TaskResponsibleBrowseResultModel {
  userId?: number;
  employeeId?: number;
  name: string;
  email?: string;

  constructor(params: ITaskResponsibleBrowseResultModel) {
    this.userId = params.userId;
    this.employeeId = params.employeeId;
    this.name = params.name;
    this.email = params.email || undefined;
  }
}
