import { AttachmentEntity } from "./attachment.entity";
import { CompanyEntity } from "./company.entity";
import { WorkspaceEntity } from "./workspace.entity";

export type IDocumentVersionEntity = {
  id: string;
  name: string;
  description: string;
  version: string;
  attachments: AttachmentEntity[];
  fileUrl?: string;

  workspace: WorkspaceEntity;
  company: CompanyEntity;
}

export class DocumentVersionEntity {
  id: string;
  name: string;
  fileUrl?: string;

  workspace: WorkspaceEntity;
  company: CompanyEntity;

  constructor(partial: IDocumentVersionEntity) {
    this.id = partial.id;
    this.name = partial.name;
    this.workspace = partial.workspace;
    this.company = partial.company;
    this.fileUrl = partial.fileUrl;
  }
}
