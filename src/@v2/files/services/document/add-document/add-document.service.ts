import { Inject, Injectable } from '@nestjs/common'

import { DocumentTokens } from '@/@modules/documents/constants/tokens'
import { DocumentRepository } from '@/@modules/documents/database/repositories/document/document.repository'
import { Document } from '@/@modules/documents/domain/entities'
import { Storage } from '@/@modules/shared/adapters/storage'
import { SharedTokens } from '@/@modules/shared/di/tokens'
import { DocumentFile } from '@/@modules/shared/utils/types/document-file'

import { AddDocument } from './add-document.interface'

@Injectable()
export class AddDocumentService implements AddDocument {
  constructor(
    @Inject(SharedTokens.Storage)
    private readonly storage: Storage,

    @Inject(DocumentTokens.DocumentRepository)
    private readonly documentRepository: DocumentRepository
  ) {}

  async add(params: AddDocument.Params): AddDocument.Result {
    const { url } = await this.storage.create({
      file: params.buffer,
      fileName: params.fileName
    })

    const document = new Document({
      fileName: params.fileName,
      bucket: params.bucket,
      url,
      shouldDelete: params.shouldDelete ?? true,
      resourceId: String(params.resourceId)
    })

    const createdDocument = await this.documentRepository.create(document)
    const output = new DocumentFile(createdDocument)

    return [output, null]
  }
}
