import { IDocumentFactoryProduct } from '../../factories/document/types/document-factory.types';

export namespace IDocumentCreation {
  export type Params<T, R> = {
    product: IDocumentFactoryProduct<T, R>;
    body: T;
  };
}
