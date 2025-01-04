import { IPaginationModelMapper, PaginationModelMapper } from '@/@v2/shared/utils/database/pagination-mapper';
import { HierarchyBrowseShortResultModelMapper, IHierarchyBrowseShortResultModelMapper } from './hierarchy-browse-short-result.mapper';
import { HierarchyBrowseShortModel } from '@/@v2/security/action-plan/domain/models/hierarchy/hierarchy-browse-short.model';

export type IHierarchyBrowseShortModelMapper = {
  results: IHierarchyBrowseShortResultModelMapper[]
  pagination: IPaginationModelMapper
}

export class HierarchyBrowseShortModelMapper {
  static toModel(prisma: IHierarchyBrowseShortModelMapper): HierarchyBrowseShortModel {
    return new HierarchyBrowseShortModel({
      results: HierarchyBrowseShortResultModelMapper.toModels(prisma.results),
      pagination: PaginationModelMapper.toModel(prisma.pagination),
    })
  }
}
