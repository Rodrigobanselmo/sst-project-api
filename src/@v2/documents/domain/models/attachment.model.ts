import { AttachmentEntity } from "../entities/attachment.entity";

export type IAttachmentModel = {
  name: string;
  url: string;
}

export class AttachmentModel {
  name: string;
  url: string;

  constructor(partial: IAttachmentModel) {
    this.name = partial.name;
    this.url = partial.url;
  }

  static fromEntity(entity: AttachmentEntity) {
    return new AttachmentModel({
      name: entity.name,
      url: entity.url,
    })
  }

  static fromEntities(entities: AttachmentEntity[]) {
    return entities.map(entity => AttachmentModel.fromEntity(entity));
  }
}
