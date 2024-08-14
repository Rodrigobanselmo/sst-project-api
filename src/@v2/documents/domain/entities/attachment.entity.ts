
export type IAttachmentEntity = {
  id: string;
  name: string;
  riskId: string;
}

export class AttachmentEntity {
  id: string;
  name: string;
  riskId: string;

  constructor(partial: IAttachmentEntity) {
    this.id = partial.id;
    this.name = partial.name;
    this.riskId = partial.riskId;
  }
}
