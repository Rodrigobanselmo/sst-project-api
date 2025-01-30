import { forwardRef, Module } from '@nestjs/common'

import { SharedModule } from '@/@modules/shared/shared.module'

import { DocumentTokens } from './constants/tokens'
import { DeleteUnusedDocumentsCron } from './handlers/cron/delete-unused-documents/delete-unused-documents.cron'
import { AddDocumentService } from './services/document/add-document'
import { DeleteUnusedDocumentService } from './services/document/delete-unused-document'
import { ReadDocumentService } from './services/document/read-document'
import { PrismaDocumentRepository } from './database/repositories/document/prisma-document.repository'

@Module({
  imports: [forwardRef(() => SharedModule)],
  controllers: [],
  providers: [
    DeleteUnusedDocumentsCron,
    {
      provide: DocumentTokens.DocumentRepository,
      useClass: PrismaDocumentRepository
    },
    {
      provide: DocumentTokens.DeleteUnusedDocumentService,
      useClass: DeleteUnusedDocumentService
    },
    {
      provide: DocumentTokens.ReadDocumentService,
      useClass: ReadDocumentService
    },
    {
      provide: DocumentTokens.AddDocumentService,
      useClass: AddDocumentService
    }
  ],
  exports: [DocumentTokens.AddDocumentService, DocumentTokens.ReadDocumentService]
})
export class DocumentModule {}
