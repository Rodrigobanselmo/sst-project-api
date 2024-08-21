import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service'
import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { IRiskDataDAO } from './risk-data.types'
import { RiskDataMapper } from '../../models/risk-data.mapper'


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

    return RiskDataMapper.toModels(RiskDatas)
  }


}
