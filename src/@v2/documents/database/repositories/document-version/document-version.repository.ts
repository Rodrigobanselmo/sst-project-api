import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service'
import { Injectable } from '@nestjs/common'
import { Prisma, StatusEnum } from '@prisma/client'
import { IDocumentVersionRepository } from './document-version.types'
import { DocumentVersionMapper } from '../../mappers/document-version.mapper'


@Injectable()
export class DocumentVersionRepository {
  constructor(
    private readonly prisma: PrismaServiceV2,
  ) { }

  static selectOptions() {
    const include = { attachments: true } satisfies Prisma.RiskFactorDocumentFindFirstArgs['include']

    return { include }
  }

  async find(params: IDocumentVersionRepository.FindParams) {
    const documentversion = await this.prisma.riskFactorDocument.findUnique({
      where: { id: params.id },
      ...DocumentVersionRepository.selectOptions()
    })

    return documentversion ? documentversion : null
  }

  async update(entity: IDocumentVersionRepository.EditParams) {
    const documentversion = await this.prisma.riskFactorDocument.update({
      ...DocumentVersionRepository.selectOptions(),
      where: { id: entity.id },
      data: {
        attachments: {
          createMany: {
            data: entity.attachments.map(attachment => ({
              url: attachment.url,
              name: attachment.name,
              id: attachment.id,
            }))
          }
        },
        status: StatusEnum[entity.status],
        fileUrl: entity.fileUrl,
      }
    })

    return DocumentVersionMapper.toEntity(documentversion)
  }
}
