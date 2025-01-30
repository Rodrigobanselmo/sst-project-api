import { DocumentStatusEnum } from '../enums/document-status.enum';

export type IDocumentControlEntity = {
  id: number;
  companyId: string;
  workspaceId: string;
  name: string;
  description: string | null;
  type: string;
  status: DocumentStatusEnum;
  createdAt: Date;
  updatedAt: Date;
};

export class DocumentControlEntity {
  id: number;
  name: string;
  description: string | null;
  type: string;
  status: DocumentStatusEnum;
  createdAt: Date;
  updatedAt: Date;
  companyId: string;
  workspaceId: string;

  constructor(params: IDocumentControlEntity) {
    this.id = params.id;
    this.name = params.name;
    this.description = params.description;
    this.type = params.type;
    this.status = params.status;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
    this.companyId = params.companyId;
    this.workspaceId = params.workspaceId;
  }
}
