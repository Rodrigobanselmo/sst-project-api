import { IPaginationModelMapper, PaginationModelMapper } from '@/@v2/shared/utils/database/pagination-mapper';
import { HierarchyBrowseResultModelMapper, IHierarchyBrowseResultModelMapper } from './hierarchy-browse-result.mapper';
import { HierarchyBrowseModel } from '@/@v2/enterprise/hierarchy/domain/models/hierarchies/hierarchy-browse.model';

export type IHierarchyBrowseModelMapper = {
  results: IHierarchyBrowseResultModelMapper[];
  pagination: IPaginationModelMapper;
};

export class HierarchyBrowseModelMapper {
  static toModel(prisma: IHierarchyBrowseModelMapper): HierarchyBrowseModel {
    return new HierarchyBrowseModel({
      results: HierarchyBrowseResultModelMapper.toModels(prisma.results),
      pagination: PaginationModelMapper.toModel(prisma.pagination),
    });
  }
}
