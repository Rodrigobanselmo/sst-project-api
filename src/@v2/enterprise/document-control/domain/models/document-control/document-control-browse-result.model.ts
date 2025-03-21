import { FileModel } from '@/@v2/shared/models/common/file.model';

export type IDocumentControlBrowseResultModel = {
  id: number;
  name: string;
  description: string | undefined;
  endDate: Date | undefined;
  startDate: Date | undefined;
  type: string;
  file: FileModel | undefined;
  createdAt: Date;
  updatedAt: Date;
};

export class DocumentControlBrowseResultModel {
  id: number;
  name: string;
  description: string | undefined;
  endDate: Date | undefined;
  startDate: Date | undefined;
  type: string;
  file: FileModel | undefined;
  createdAt: Date;
  updatedAt: Date;

  constructor(params: IDocumentControlBrowseResultModel) {
    this.id = params.id;
    this.name = params.name;
    this.description = params.description;
    this.endDate = params.endDate;
    this.startDate = params.startDate;
    this.type = params.type;
    this.file = params.file;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
  }
}
