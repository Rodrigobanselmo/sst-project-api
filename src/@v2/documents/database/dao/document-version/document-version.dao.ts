import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service'
import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { IDocumentVersionRepository } from './document-version.types'
import { DocumentBaseDAO } from '../document-base/document-base.dao'
import { DocumentVersionMapper } from '../../mappers/document-version.mapper'
import { parseDocumentGenerationSnapshot } from '@/@v2/documents/domain/types/document-generation-snapshot.type'
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

    const snapshot = parseDocumentGenerationSnapshot(
      documentversion.generationSnapshot,
    )
    const supplementalProfessionalSignatures = await this.resolveSupplementalProfessionalSignatures(
      snapshot,
      documentversion.documentData.professionalsSignatures,
    )

    applyGenerationSnapshotToDocumentData(
      documentversion.documentData,
      documentversion.generationSnapshot,
      { supplementalProfessionalSignatures },
    )

    return DocumentVersionMapper.toModel(documentversion)
  }

  async updateDocumentDate(id: string, documentDate: Date) {
    await this.prisma.riskFactorDocument.update({
      where: { id },
      data: { documentDate },
    });
  }

  private async resolveSupplementalProfessionalSignatures(
    snapshot: ReturnType<typeof parseDocumentGenerationSnapshot>,
    existingSignatures?: Array<{ professionalId: number }>,
  ) {
    const supplementalProfessionalSignatures = new Map<
      number,
      {
        professionalId: number;
        isSigner: boolean;
        isElaborator: boolean;
        professional: unknown;
      }
    >()

    if (!snapshot?.professionalSignatures?.length) {
      return supplementalProfessionalSignatures
    }

    const existingIds = new Set(
      (existingSignatures || []).map((signature) => signature.professionalId),
    )
    const missingCouncilIds = snapshot.professionalSignatures
      .map((signature) => signature.professionalId)
      .filter((professionalId) => !existingIds.has(professionalId))

    if (!missingCouncilIds.length) {
      return supplementalProfessionalSignatures
    }

    const councils = await this.prisma.professionalCouncil.findMany({
      where: { id: { in: missingCouncilIds } },
      include: {
        professional: true,
      },
    })

    councils.forEach((council) => {
      supplementalProfessionalSignatures.set(council.id, {
        professionalId: council.id,
        isSigner: false,
        isElaborator: false,
        professional: council,
      })
    })

    return supplementalProfessionalSignatures
  }
}
