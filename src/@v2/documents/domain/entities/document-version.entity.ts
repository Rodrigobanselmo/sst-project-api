import { AttachmentEntity } from "./attachment.entity";

export type IDocumentVersionEntity = {
  id: string;
  name: string | null;
  description: string;
  version: string;
  attachments: AttachmentEntity[];
  fileUrl: string | null;
}

export class DocumentVersionEntity {
  id: string;
  name: string | null;
  description: string;
  version: string;
  attachments: AttachmentEntity[];
  fileUrl: string | null;

  constructor(partial: IDocumentVersionEntity) {
    this.id = partial.id;
    this.name = partial.name;
    this.description = partial.description;
    this.version = partial.version;
    this.attachments = partial.attachments;
    this.fileUrl = partial.fileUrl;
  }
}
