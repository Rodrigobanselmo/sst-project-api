
import { IDocumentFactoryProduct } from '../../factories/document/types/document-factory.types'

export namespace IDocumentCreation {
  export type Params<T> = {
    product: IDocumentFactoryProduct<T>
    body: T
  }
}
