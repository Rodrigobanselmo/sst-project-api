import {
  DocumentModel,
  DocumentModelClassificationEnum,
  DocumentTypeEnum,
  StatusEnum,
} from '@prisma/client';
import { IDocumentModelData } from '../types/document-mode.types';

export class DocumentModelEntity implements DocumentModel {
  id: number;
  name: string;
  description: string;
  companyId: string;
  system: boolean;
  status: StatusEnum;
  classifications: DocumentModelClassificationEnum[];
  created_at: Date;
  updated_at: Date;
  type: DocumentTypeEnum;
  data: Buffer;
  dataJson?: IDocumentModelData;
  errorParse?: any;

  constructor(partial: Partial<DocumentModelEntity>) {
    Object.assign(this, partial);
    if (!this.classifications) this.classifications = [];

    if (this.data) {
      try {
        this.dataJson = JSON.parse(this.data.toString('utf8'));
        delete this.data;
      } catch (e) {
        this.errorParse = e;
      }
    }
  }
}
