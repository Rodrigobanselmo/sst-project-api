import { Inject, Injectable } from '@nestjs/common'
import { captureException } from '@sentry/node'

import { DocumentRepository } from '@/@modules/documents/database/repositories/document/document.repository'
import { DocumentTokens } from '@/@modules/documents/constants/tokens'
import { Storage } from '@/@modules/shared/adapters/storage'
import { SharedTokens } from '@/@modules/shared/di/tokens'
import { asyncBatch } from '@/@modules/shared/utils/async/asyncBatch'

import { DeleteUnusedDocument } from './delete-unused-document.interface'

@Injectable()
export class DeleteUnusedDocumentService implements DeleteUnusedDocument {
  constructor(
    @Inject(SharedTokens.Storage)
    private readonly storage: Storage,

    @Inject(DocumentTokens.DocumentRepository)
    private readonly documentRepository: DocumentRepository
  ) {}

  async delete() {
    const [documents] = await this.documentRepository.findMany()

    asyncBatch({
      items: documents,
      batchSize: 10,
      callback: async (document) => {
        try {
          await this.storage.remove({ fileName: document.fileName, bucket: document.bucket })
          await this.documentRepository.delete({ documentId: document.id })
        } catch (error) {
          captureException(error, { extra: { documentId: document.id, action: 'delete unused document' } })
        }
      }
    })
  }
}
