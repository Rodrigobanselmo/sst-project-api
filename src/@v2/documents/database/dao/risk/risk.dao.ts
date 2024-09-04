import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service'
import { CompanyQueries } from '@/@v2/shared/utils/database/company.queries'
import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'


@Injectable()
export class RiskDAO {
  constructor(
    private readonly prisma: PrismaServiceV2,
  ) { }

  static selectOptions({ companyId }: { companyId: string }) {
    const include = {
      docInfo: {
        where: {
          company: CompanyQueries.CompanyAndConsultantFilter({ companyId }),
          OR: [{
            hierarchy: { companyId }
          }, {
            hierarchyId: null
          }]
        }
      },
    } satisfies Prisma.RiskFactorsFindFirstArgs['include']

    return { include }
  }
}
