import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service'
import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
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

  async readById(params: IDocumentVersionRepository.ReadByIdParams) {
    const documentversion = await this.prisma.riskFactorDocument.findUnique({
      where: { id: params.id },
      ...DocumentVersionRepository.selectOptions()
    })

    return documentversion ? documentversion : null
  }


}
