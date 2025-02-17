import { SystemFile } from '@/@v2/shared/domain/types/shared/system-file';
import { DocumentStatusEnum } from '../enums/document-status.enum';
import { updateField } from '@/@v2/shared/domain/helpers/update-field.helper';

type IUpdatePrams = {
  name?: string;
  description?: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
};

export type IDocumentControlFileEntity = {
  id?: number;
  companyId: string;
  documentControlId: number;
  name: string;
  description?: string | null;
  startDate: Date | null;
  endDate: Date | null;
  status?: DocumentStatusEnum;
  createdAt?: Date;
  updatedAt?: Date;
  file: SystemFile;
};

export class DocumentControlFileEntity {
  id: number;
  companyId: string;
  documentControlId: number;
  name: string;
  description: string | null;
  startDate: Date | null;
  endDate: Date | null;
  status: DocumentStatusEnum;
  createdAt: Date;
  updatedAt: Date;
  file: SystemFile;

  constructor(params: IDocumentControlFileEntity) {
    this.id = params.id | 0;
    this.documentControlId = params.documentControlId;
    this.companyId = params.companyId;
    this.name = params.name;
    this.description = params.description || null;
    this.startDate = params.startDate || null;
    this.endDate = params.endDate || null;
    this.status = params.status || DocumentStatusEnum.ACTIVE;
    this.createdAt = params.createdAt || new Date();
    this.updatedAt = params.updatedAt || new Date();
    this.file = params.file;
  }

  update(data: IUpdatePrams) {
    this.name = updateField(this.name, data.name);
    this.startDate = updateField(this.startDate, data.startDate);
    this.endDate = updateField(this.endDate, data.endDate);
    this.description = updateField(this.description, data.description);
  }
}
