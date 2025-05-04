export type ITaskProjectMemberEntity = {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
  userId: number;
};

export class TaskProjectMemberEntity {
  id: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
  userId: number;

  constructor(params: ITaskProjectMemberEntity) {
    this.id = params.id || -1;
    this.createdAt = params.createdAt || new Date();
    this.updatedAt = params.updatedAt || new Date();
    this.deletedAt = params.deletedAt || null;
    this.userId = params.userId;
  }
}
