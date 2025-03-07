import { DocumentVersionStatus } from "aws-sdk/clients/workdocs";
import { AttachmentEntity } from "./attachment.entity";

export type IDocumentVersionEntity = {
  id: string;
  status: DocumentVersionStatus;
  fileUrl: string | null;
  attachments: AttachmentEntity[];
}

export class DocumentVersionEntity {
  id: string;
  status: DocumentVersionStatus;
  attachments: AttachmentEntity[];
  fileUrl: string | null;

  constructor(params: IDocumentVersionEntity) {
    this.id = params.id;
    this.status = params.status;
    this.attachments = params.attachments;
    this.fileUrl = params.fileUrl;
  }
}
