import { Document as PrismaDocument } from '@prisma/client'

import { Document } from '../../domain/entities'

export type DocumentModelConstructor = PrismaDocument

export class DocumentModel {
  static toEntity(prisma: DocumentModelConstructor): Document {
    return new Document({
      id: prisma.id,
      fileName: prisma.filename,
      url: prisma.document_url,
      resourceId: prisma.resource_id || undefined,
      shouldDelete: prisma.should_delete || undefined,
      bucket: prisma.bucket_name
    })
  }

  static toArray(prisma: DocumentModelConstructor[]) {
    return prisma.map((p: DocumentModelConstructor) => DocumentModel.toEntity(p))
  }
}
