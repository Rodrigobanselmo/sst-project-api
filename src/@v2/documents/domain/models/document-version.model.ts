import { AttachmentModel } from "./attachment.model";
import { DocumentBaseModel } from "./document-base.model";

export type IDocumentVersionModel = {
  id: string;
  name: string | null;
  description: string;
  version: string;
  fileUrl: string | null;
  createdAt: Date;
  attachments: AttachmentModel[];
  documentBase: DocumentBaseModel;
}

export class DocumentVersionModel {
  id: string;
  name: string | null;
  description: string;
  version: string;
  fileUrl: string | null;
  createdAt: Date;
  attachments: AttachmentModel[];
  documentBase: DocumentBaseModel;

  constructor(params: IDocumentVersionModel) {
    this.id = params.id;
    this.name = params.name;
    this.description = params.description;
    this.version = params.version;
    this.fileUrl = params.fileUrl;
    this.createdAt = params.createdAt
    this.attachments = params.attachments;
    this.documentBase = params.documentBase;
  }
}
