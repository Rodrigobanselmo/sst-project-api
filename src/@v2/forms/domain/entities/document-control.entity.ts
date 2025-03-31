import { updateField } from '@/@v2/shared/domain/helpers/update-field.helper';
import { DocumentStatusEnum } from '../enums/document-status.enum';

type IUpdatePrams = {
  name?: string;
  description?: string | null;
  type?: string;
};

export type IDocumentControlEntity = {
  id?: number;
  companyId: string;
  workspaceId: string;
  name: string;
  description: string | null;
  type: string;
  status?: DocumentStatusEnum;
  createdAt?: Date;
  updatedAt?: Date;
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
    this.id = params.id || 0;
    this.name = params.name;
    this.description = params.description;
    this.type = params.type;
    this.status = params.status || DocumentStatusEnum.ACTIVE;
    this.createdAt = params.createdAt || new Date();
    this.updatedAt = params.updatedAt || new Date();
    this.companyId = params.companyId;
    this.workspaceId = params.workspaceId;
  }

  update(params: IUpdatePrams) {
    this.name = updateField(this.name, params.name);
    this.description = updateField(this.description, params.description);
    this.type = updateField(this.type, params.type);
  }
}
