import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service'
import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { DocumentBaseModel } from '../../models/document-base.model'
import { IDocumentBaseRepository } from './document-base.types'


@Injectable()
export class DocumentBaseRepository {
  constructor(
    private readonly prisma: PrismaServiceV2,
  ) { }

  static selectOptions() {
    const include = {
      model: true,
      workspace: true,
      company: true,
      professionalsSignatures: {
        include: {
          professional: {
            include: {
              professional: true
            }
          }
        }
      }
    } satisfies Prisma.DocumentDataFindFirstArgs['include']

    return { include }
  }

  async findById(params: IDocumentBaseRepository.FindByIdParams) {
    const documentbase = await this.prisma.documentData.findUnique({
      where: { id_companyId: { id: params.id, companyId: params.companyId } },
      ...DocumentBaseRepository.selectOptions()
    })

    return documentbase ? DocumentBaseModel.toEntity({
      ...documentbase,
      workspace: documentbase.workspace,
      company: documentbase.company,
      model: documentbase.model,
      professionalsSignatures: documentbase.professionalsSignatures
    }) : null
  }


}
