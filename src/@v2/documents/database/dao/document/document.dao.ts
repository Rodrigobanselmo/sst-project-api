import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service'
import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { HierarchyModel } from '../../models/hierarchy.model'
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
      where: { id: params.id, workspaces: { some: { id: params.wokspaceId } } },
      ...HierarchyDAO.selectOptions()
    })

    return HierarchyModel.toEntities(hierarchies)
  }


}
