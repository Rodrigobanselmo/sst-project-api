
export type IAttachmentEntity = {
  id: string;
  name: string;
  url: string;
}

export class AttachmentEntity {
  id: string;
  name: string;
  url: string;

  constructor(partial: IAttachmentEntity) {
    this.id = partial.id;
    this.name = partial.name;
    this.url = partial.url;
  }
}
