import { Document } from '@/@modules/documents/domain/entities'

export interface DocumentRepository {
  create(doc: Document): Promise<Document>
  find(params: DocumentRepository.FindParams): Promise<Document | null>
  findMany(params?: DocumentRepository.FindManyParams): Promise<[Document[], number]>
  delete(params: DocumentRepository.DeleteParams): Promise<void>
}

export namespace DocumentRepository {
  export type FindManyParams = {
    limit?: number
    offset?: number
  }

  export type FindParams = { documentId: number; resourceId: string }

  export type DeleteParams = { documentId: number }
}
