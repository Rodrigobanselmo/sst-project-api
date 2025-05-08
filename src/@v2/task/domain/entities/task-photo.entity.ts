export type ITaskPhotoEntity = {
  id?: number;
  fileId: string;
  deletedAt?: Date | null;
};

export class TaskPhotoEntity {
  id: number;
  fileId: string;
  deletedAt: Date | null;

  constructor(params: ITaskPhotoEntity) {
    this.id = params.id || -1;
    this.deletedAt = params.deletedAt || null;
    this.fileId = params.fileId;
  }

  get isNew() {
    return this.id === -1;
  }

  get isDeleted() {
    return !!this.deletedAt;
  }

  delete() {
    this.deletedAt = new Date();
  }
}
