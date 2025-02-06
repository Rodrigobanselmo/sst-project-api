import { DocumentControlAggregate } from '../../../domain/aggregates/document-control.aggregate';

export namespace IDocumentControlAggregateRepository {
  export type CreateParams = DocumentControlAggregate;
  export type CreateReturn = Promise<DocumentControlAggregate | null>;

  export type UpdateParams = DocumentControlAggregate;
  export type UpdateReturn = Promise<DocumentControlAggregate | null>;

  export type FindParams = { id: number; companyId: string };
  export type FindReturn = Promise<DocumentControlAggregate | null>;

  export type DeleteParams = { id: number; companyId: string };
}
