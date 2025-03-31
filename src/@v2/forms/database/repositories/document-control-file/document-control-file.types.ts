import { DocumentControlFileEntity } from '../../../domain/entities/document-control-file.entity';

export namespace IDocumentControlRepository {
  export type CreateParams = DocumentControlFileEntity;
  export type CreateReturn = Promise<DocumentControlFileEntity | null>;

  export type UpdateParams = DocumentControlFileEntity;
  export type UpdateReturn = Promise<DocumentControlFileEntity | null>;

  export type FindParams = { id: number; companyId: string };
  export type FindReturn = Promise<DocumentControlFileEntity | null>;

  export type DeleteParams = DocumentControlFileEntity;
}
