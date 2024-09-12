import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'


@Injectable()
export class DocumentBaseDAO {
  constructor() { }

  static selectOptions() {
    const include = {
      model: true,
      workspace: {
        include: {
          address: true
        }
      },
      company: {
        include: {
          address: true,
          primary_activity: true,
          covers: true,
          receivingServiceContracts: {
            select: {
              applyingServiceCompany: {
                include: {
                  covers: true,
                  address: true
                }
              }
            }
          },
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
      },
    } satisfies Prisma.DocumentDataFindFirstArgs['include']

    return { include }
  }
}
