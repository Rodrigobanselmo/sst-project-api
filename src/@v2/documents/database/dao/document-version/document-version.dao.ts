import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service'
import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { IDocumentVersionRepository } from './document-version.types'
import { DocumentBaseDAO } from '../document-base/document-base.dao'
import { DocumentVersionMapper } from '../../mappers/document-version.mapper'
import {
  applyGenerationSnapshotToDocumentData,
  resolveSnapshotModelId,
} from '../../utils/apply-generation-snapshot.util'


@Injectable()
export class DocumentVersionDAO {
  constructor(
    private readonly prisma: PrismaServiceV2,
  ) { }

  static selectOptions() {
    const include = { attachments: true, documentData: DocumentBaseDAO.selectOptions() } satisfies Prisma.RiskFactorDocumentFindFirstArgs['include']

    return { include }
  }

  async find(params: IDocumentVersionRepository.FindByIdParams) {
    const documentversion = await this.prisma.riskFactorDocument.findUnique({
      where: { id: params.id },
      ...DocumentVersionDAO.selectOptions()
    })

    if (!documentversion) return null

    const snapshotModelId = resolveSnapshotModelId(
      documentversion.generationSnapshot,
      documentversion.documentData.modelId,
    )

    if (snapshotModelId && snapshotModelId !== documentversion.documentData.modelId) {
      const model = await this.prisma.documentModel.findUnique({
        where: { id: snapshotModelId },
      })

      if (model) {
        documentversion.documentData.model = model
        documentversion.documentData.modelId = model.id
      }
    }

    applyGenerationSnapshotToDocumentData(
      documentversion.documentData,
      documentversion.generationSnapshot,
    )

    return DocumentVersionMapper.toModel(documentversion)
  }

  async updateDocumentDate(id: string, documentDate: Date) {
    await this.prisma.riskFactorDocument.update({
      where: { id },
      data: { documentDate },
    });
  }
}
