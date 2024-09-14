import { DocumentVersionEntity } from "@/@v2/documents/domain/entities/document-version.entity";

export namespace IDocumentVersionRepository {
  export type FindParams = { id: string; }
  export type EditParams = DocumentVersionEntity;
}