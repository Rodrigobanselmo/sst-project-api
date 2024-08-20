import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service'
import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { IRiskDataDAO } from './risk-data.types'
import { RiskDataModel } from '../../models/risk-data.model'


@Injectable()
export class RiskDataDAO {
  constructor(
    private readonly prisma: PrismaServiceV2,
  ) { }

  static selectOptions() {
    const include = {
      riskFactor: true
    } satisfies Prisma.RiskFactorDataFindFirstArgs['include']

    return { include }
  }

  async findMany(params: IRiskDataDAO.FindByIdParams) {
    const RiskDatas = await this.prisma.riskFactorData.findMany({
      where: {
        homogeneousGroup: {
          workspaces: { some: { id: params.wokspaceId } }
        }
      },
      ...RiskDataDAO.selectOptions()
    })

    return RiskDataModel.toEntities(RiskDatas)
  }


}
