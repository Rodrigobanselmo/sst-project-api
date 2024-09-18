import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service'
import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { IDocumentVersionRepository } from './document-version.types'
import { DocumentBaseDAO } from '../document-base/document-base.dao'
import { DocumentVersionMapper } from '../../mappers/document-version.mapper'


@Injectable()
export class DocumentVersionDAO {
  constructor(
    private readonly prisma: PrismaServiceV2,
  ) { }

  static selectOptions() {
    const include = { attachments: true, documentData: DocumentBaseDAO.selectOptions() } satisfies Prisma.RiskFactorDocumentFindFirstArgs['include']

    return { include }
  }

  async findById(params: IDocumentVersionRepository.FindByIdParams) {
    const documentversion = await this.prisma.riskFactorDocument.findUnique({
      where: { id: params.id },
      ...DocumentVersionDAO.selectOptions()
    })

    return documentversion ? DocumentVersionMapper.toModel(documentversion) : null
  }


}
