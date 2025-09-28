import { Injectable } from '@nestjs/common';
import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { IBrowseHierarchiesUseCase } from './browse-hierarchies.types';
import { HierarchyBrowseShortQuery } from '@/@v2/enterprise/hierarchy/database/dao/hierarchy/queries/browse-short-hierarchy.dao';
import { HierarchyTypeEnum } from '@/@v2/shared/domain/enum/company/hierarchy-type.enum';

@Injectable()
export class BrowseHierarchiesUseCase {
  constructor(private readonly prisma: PrismaServiceV2) {}

  async execute(params: IBrowseHierarchiesUseCase.Params) {
    return new HierarchyBrowseShortQuery(this.prisma).browseShort({
      filters: {
        companyId: params.companyId,
        type: [HierarchyTypeEnum.DIRECTORY, HierarchyTypeEnum.MANAGEMENT, HierarchyTypeEnum.SECTOR, HierarchyTypeEnum.SUB_SECTOR, HierarchyTypeEnum.OFFICE],
      },
    });
  }
}
