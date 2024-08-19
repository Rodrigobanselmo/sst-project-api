import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service'
import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { DocumentVersionModel } from '../../models/document-version.model'
import { IDocumentVersionRepository } from './document-version.types'


@Injectable()
export class DocumentVersionRepository {
  constructor(
    private readonly prisma: PrismaServiceV2,
  ) { }

  static selectOptions() {
    const include = { attachments: true } satisfies Prisma.RiskFactorDocumentFindFirstArgs['include']

    return { include }
  }

  async findById(params: IDocumentVersionRepository.FindByIdParams) {
    const documentversion = await this.prisma.riskFactorDocument.findUnique({
      where: { id_companyId: { id: params.id, companyId: params.companyId } },
      ...DocumentVersionRepository.selectOptions()
    })

    return documentversion ? DocumentVersionModel.toEntity(documentversion) : null
  }


}
