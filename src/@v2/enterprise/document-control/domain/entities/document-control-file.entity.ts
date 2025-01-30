import { SystemFile } from '@/@v2/shared/domain/types/shared/system-file';
import { DocumentStatusEnum } from '../enums/document-status.enum';

export type IDocumentControlFileEntity = {
  id: number;
  companyId: string;
  name: string;
  startDate: Date;
  endDate: Date | null;
  status: DocumentStatusEnum;
  createdAt: Date;
  updatedAt: Date;
  file: SystemFile;
};

export class DocumentControlFileEntity {
  id: number;
  companyId: string;
  name: string;
  startDate: Date;
  endDate: Date | null;
  status: DocumentStatusEnum;
  createdAt: Date;
  updatedAt: Date;
  file: SystemFile;

  constructor(params: IDocumentControlFileEntity) {
    this.id = params.id;
    this.companyId = params.companyId;
    this.name = params.name;
    this.startDate = params.startDate;
    this.endDate = params.endDate;
    this.status = params.status;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
    this.file = params.file;
  }
}
