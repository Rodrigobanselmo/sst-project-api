import { Prisma } from '@prisma/client'
import { Injectable } from '@nestjs/common'

import { PrismaService } from '@/@modules/shared'
import { Document } from '@/@modules/documents/domain/entities'
import { config } from '@/@modules/shared/config'

import { DocumentModel } from '../../models/document.model'

import { DocumentRepository } from './document.repository'

@Injectable()
export class PrismaDocumentRepository implements DocumentRepository {
  constructor(private readonly prisma: PrismaService) {}

  private documentUnusedFilter() {
    const beforeOneDay = new Date(new Date().setDate(new Date().getDate() - 1))
    const where = {
      should_delete: true,
      created_at: {
        lte: beforeOneDay
      }
    } satisfies Prisma.DocumentFindManyArgs['where']

    return where
  }

  async findMany(filters: DocumentRepository.FindManyParams): Promise<[Document[], number]> {
    const [documents, total] = await Promise.all([
      this.prisma.document.findMany({
        take: filters?.limit || undefined,
        skip: filters?.offset || undefined,
        where: this.documentUnusedFilter()
      }),
      this.prisma.document.count({ where: this.documentUnusedFilter() })
    ])

    return [DocumentModel.toArray(documents), total]
  }

  async delete(params: DocumentRepository.DeleteParams): Promise<void> {
    await this.prisma.document.deleteMany({
      where: {
        id: params.documentId,
        ...this.documentUnusedFilter()
      }
    })
  }

  async find(params: DocumentRepository.FindParams): Promise<Document | null> {
    const prismaDocument = await this.prisma.document.findFirst({
      where: {
        id: params.documentId,
        resource_id: params.resourceId,
        should_delete: true
      }
    })

    return prismaDocument ? DocumentModel.toEntity(prismaDocument) : null
  }

  async create(document: Document): Promise<Document> {
    const prismaDocument = await this.prisma.document.create({
      data: {
        resource_id: document.resourceId,
        should_delete: true,
        filename: document.fileName,
        document_url: document.url,
        bucket_name: config.aws.s3.bucket
      }
    })

    return DocumentModel.toEntity(prismaDocument)
  }
}
