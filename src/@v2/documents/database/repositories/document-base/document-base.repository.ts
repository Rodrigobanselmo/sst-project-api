import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service'
import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { IDocumentBaseRepository } from './document-base.types'
import { DocumentBaseMapper } from '../../models/document-base.mapper'


@Injectable()
export class DocumentBaseRepository {
  constructor(
    private readonly prisma: PrismaServiceV2,
  ) { }

  static selectOptions() {
    const include = {
      model: true,
      workspace: true,
      company: {
        include: {
          receivingServiceContracts: {
            select: {
              applyingServiceCompany: true
            }
          }
        }
      },
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
      where: { id: params.id },
      ...DocumentBaseRepository.selectOptions()
    })

    return documentbase ? documentbase : null
  }


}
