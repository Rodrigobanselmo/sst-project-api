import { FileModel } from '@/@v2/shared/models/common/file.model';
import { SystemFile } from '@/@v2/shared/domain/types/shared/system-file';

export type IDocumentControlReadModel = {
  id: string;
  name: string;
  type: string;
  description: string | undefined;
  createdAt: Date;
  updatedAt: Date;

  files: {
    name: string;
    endDate: Date | undefined;
    startDate: Date | undefined;
    file: FileModel;
  }[];
};

export class DocumentControlReadModel {
  id: string;
  name: string;
  type: string;
  description: string | undefined;
  createdAt: Date;
  updatedAt: Date;

  files: {
    name: string;
    endDate: Date | undefined;
    startDate: Date | undefined;
    file: FileModel;
  }[];

  constructor(params: IDocumentControlReadModel) {
    this.id = params.id;
    this.name = params.name;
    this.type = params.type;
    this.description = params.description;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;

    this.files = params.files;
  }
}
