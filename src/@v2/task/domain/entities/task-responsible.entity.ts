export type ITaskResponsibleEntity = {
  userId: number;
};

export class TaskResponsibleEntity {
  userId: number;

  constructor(params: ITaskResponsibleEntity) {
    this.userId = params.userId;
  }
}
