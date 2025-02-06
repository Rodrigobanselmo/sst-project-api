import { DocumentControlEntity } from '../../../domain/entities/document-control.entity';

export namespace IDocumentControlRepository {
  export type CreateParams = DocumentControlEntity;
  export type CreateReturn = Promise<DocumentControlEntity | null>;

  export type UpdateParams = DocumentControlEntity;
  export type UpdateReturn = Promise<DocumentControlEntity | null>;

  export type FindParams = { id: number; companyId: string };
  export type FindReturn = Promise<DocumentControlEntity | null>;

  export type FindManyParams = { companyId?: string };
  export type FindManyReturn = Promise<DocumentControlEntity[]>;

  export type DeleteParams = DocumentControlEntity;
}
