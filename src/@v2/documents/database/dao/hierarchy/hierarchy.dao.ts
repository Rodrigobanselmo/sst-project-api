import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service'
import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { DocumentBaseModel } from '../../models/document-base.model'
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

  async findById(params: IHierarchyDAO.FindByIdParams) {
    const documentbase = await this.prisma.hierarchy.findMany({
      where: { id_companyId: { id: params.id, companyId: params.companyId } },
      ...HierarchyDAO.selectOptions()
    })

    return documentbase ? DocumentBaseModel.toEntity({
      ...documentbase,
    }) : null
  }


}
