import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service'
import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { HierarchyMapper } from '../../models/hierarchy.mapper'
import { IHierarchyDAO } from './hierarchy.types'


@Injectable()
export class HierarchyDAO {
  constructor(
    private readonly prisma: PrismaServiceV2,
  ) { }

  static selectOptions() {
    const include = {} satisfies Prisma.HierarchyFindFirstArgs['include']

    return { include }
  }

  async findMany(params: IHierarchyDAO.FindByIdParams) {
    const hierarchies = await this.prisma.hierarchy.findMany({
      where: { workspaces: { some: { id: params.workspaceId } } },
      ...HierarchyDAO.selectOptions()
    })

    return HierarchyMapper.toModels(hierarchies)
  }


}
