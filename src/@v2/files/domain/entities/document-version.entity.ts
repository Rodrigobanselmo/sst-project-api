import { AttachmentEntity } from "./attachment.entity";

export type IDocumentVersionEntity = {
  id: string;
  name: string | null;
  description: string;
  version: string;
  attachments: AttachmentEntity[];
  fileUrl: string | null;
  createdAt: Date;
}

export class DocumentVersionEntity {
  id: string;
  name: string | null;
  description: string;
  version: string;
  attachments: AttachmentEntity[];
  fileUrl: string | null;
  createdAt: Date;

  constructor(params: IDocumentVersionEntity) {
    this.id = params.id;
    this.name = params.name;
    this.description = params.description;
    this.version = params.version;
    this.attachments = params.attachments;
    this.fileUrl = params.fileUrl;
    this.createdAt = params.createdAt
  }
}
