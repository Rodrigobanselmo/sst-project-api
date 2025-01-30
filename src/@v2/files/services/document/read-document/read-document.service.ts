import { Inject, Injectable } from '@nestjs/common'

import { DocumentTokens } from '@/@modules/documents/constants/tokens'
import { errorDocumentNotFound } from '@/@modules/documents/domain/errors'
import { Storage } from '@/@modules/shared/adapters/storage'
import { SharedTokens } from '@/@modules/shared/di/tokens'
import { DocumentFile } from '@/@modules/shared/utils/types/document-file'
import { DocumentRepository } from '@/@modules/documents/database/repositories/document/document.repository'

import { ReadDocument } from './read-document.interface'

@Injectable()
export class ReadDocumentService implements ReadDocument {
  constructor(
    @Inject(SharedTokens.Storage)
    private readonly storage: Storage,

    @Inject(DocumentTokens.DocumentRepository)
    private readonly documentRepository: DocumentRepository
  ) {}

  async read(params: ReadDocument.Params): ReadDocument.Result {
    const document = await this.documentRepository.find({
      documentId: params.documentId,
      resourceId: String(params.resourceId)
    })

    if (!document) return [null, errorDocumentNotFound]

    const documentOutput = new DocumentFile(document)

    return [documentOutput, null]
  }
}
