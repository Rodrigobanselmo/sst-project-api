import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { IHierarchyDAO } from './hierarchy.types';
import { HierarchyBrowseQuerie } from './queries/browse-hierarchy.dao';
import { HierarchyBrowseShortQuerie } from './queries/browse-short-hierarchy.dao';


@Injectable()
export class HierarchyDAO {
  constructor(
    private readonly prisma: PrismaServiceV2,
  ) { }

  async browse(params: IHierarchyDAO.BrowseParams) {
    return new HierarchyBrowseQuerie(this.prisma).browse(params)
  }

  async browseShort(params: IHierarchyDAO.BrowseParams) {
    return new HierarchyBrowseShortQuerie(this.prisma).browseShort(params)
  }
}