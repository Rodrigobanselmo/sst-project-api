import { FileModel } from '@/@v2/shared/models/common/file.model';

export type IDocumentControlFileReadModel = {
  id: string;
  name: string;
  description: string | undefined;
  endDate: Date | undefined;
  startDate: Date | undefined;
  file: FileModel;
};

export class DocumentControlFileReadModel {
  id: string;
  name: string;
  description: string | undefined;
  endDate: Date | undefined;
  startDate: Date | undefined;
  file: FileModel;

  constructor(params: IDocumentControlFileReadModel) {
    this.id = params.id;
    this.name = params.name;
    this.description = params.description;
    this.endDate = params.endDate;
    this.startDate = params.startDate;
    this.file = params.file;
  }
}
