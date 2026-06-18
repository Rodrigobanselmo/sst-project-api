import { AttachmentModel } from "./attachment.model";
import { DocumentBaseModel } from "./document-base.model";

export type IDocumentVersionModel = {
  id: string;
  name: string | null;
  description: string;
  version: string;
  fileUrl: string | null;
  createdAt: Date;
  documentDate: Date | null;
  officialRevisionSeries: number | null;
  approvedBy: string | null;
  revisionBy: string | null;
  elaboratedBy: string | null;
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
  documentDate: Date | null;
  officialRevisionSeries: number | null;
  approvedBy: string | null;
  revisionBy: string | null;
  elaboratedBy: string | null;
  attachments: AttachmentModel[];
  documentBase: DocumentBaseModel;

  constructor(params: IDocumentVersionModel) {
    this.id = params.id;
    this.name = params.name;
    this.description = params.description;
    this.version = params.version;
    this.fileUrl = params.fileUrl;
    this.createdAt = params.createdAt
    this.documentDate = params.documentDate
    this.officialRevisionSeries = params.officialRevisionSeries
    this.approvedBy = params.approvedBy
    this.revisionBy = params.revisionBy
    this.elaboratedBy = params.elaboratedBy
    this.attachments = params.attachments;
    this.documentBase = params.documentBase;
  }
}
