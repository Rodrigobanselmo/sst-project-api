
export type IAttachmentModel = {
  id: string;
  name: string;
  url: string;
}

export class AttachmentModel {
  id: string;
  name: string;
  url: string;

  constructor(partial: IAttachmentModel) {
    this.id = partial.id;
    this.name = partial.name;
    this.url = partial.url;
  }
}
