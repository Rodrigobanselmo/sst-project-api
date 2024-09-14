
export type IAttachmentModel = {
  name: string;
  type: string;
  link: string;
}

export class AttachmentModel {
  name: string;
  type: string;
  link: string;

  constructor(partial: IAttachmentModel) {
    this.name = partial.name;
    this.type = partial.type;
    this.link = partial.link;
  }
}
