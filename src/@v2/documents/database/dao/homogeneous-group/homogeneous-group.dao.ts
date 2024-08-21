import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service'
import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { IHomogeneousGroupDAO } from './homogeneous-group.types'
import { HomogeneousGroupMapper } from '../../models/homogeneous-group.mapper'
import { RiskDataDAO } from '../risk-data/risk-data.dao'


@Injectable()
export class HomogeneousGroupDAO {
  constructor(
    private readonly prisma: PrismaServiceV2,
  ) { }

  static selectOptions() {
    const include = {
      riskFactorData: RiskDataDAO.selectOptions(),
    } satisfies Prisma.HomogeneousGroupFindFirstArgs['include']

    return { include }
  }

  async findMany(params: IHomogeneousGroupDAO.FindByIdParams) {
    const homogeneousGroups = await this.prisma.homogeneousGroup.findMany({
      where: { workspaces: { some: { id: params.workspaceId } } },
      ...HomogeneousGroupDAO.selectOptions()
    })

    return HomogeneousGroupMapper.toModels(homogeneousGroups)
  }


}
