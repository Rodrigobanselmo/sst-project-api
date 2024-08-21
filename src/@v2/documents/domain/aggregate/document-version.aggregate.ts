import { DocumentBaseEntity } from "../entities/document-base.entity";
import { DocumentVersionEntity } from "../entities/document-version.entity";

export type IDocumentVersionAggregate = {
  documentVersion: DocumentVersionEntity
  documentBase: DocumentBaseEntity;
}

export class DocumentVersionAggregate {
  version: DocumentVersionEntity
  base: DocumentBaseEntity;

  constructor(params: IDocumentVersionAggregate) {
    this.version = params.documentVersion;
    this.base = params.documentBase;
  }
}
