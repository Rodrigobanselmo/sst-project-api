import { updateField } from '@/@v2/shared/domain/helpers/update-field.helper';
import { DocumentControlEntity } from '../entities/document-control.entity';
import { DocumentControlFileEntity } from '../entities/document-control-file.entity';

export type IDocumentControlAggregate = {
  documentControl: DocumentControlEntity;
  files: DocumentControlFileEntity[];
};

export class DocumentControlAggregate {
  documentControl: DocumentControlEntity;
  private _files: DocumentControlFileEntity[];

  constructor(params: IDocumentControlAggregate) {
    this.documentControl = params.documentControl;
    this._files = params.files;
  }

  get files() {
    return this._files;
  }

  addFile(file: DocumentControlFileEntity) {
    this._files.push(file);
  }
}
