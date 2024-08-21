import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'


@Injectable()
export class DocumentBaseDAO {
  constructor() { }

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
}
