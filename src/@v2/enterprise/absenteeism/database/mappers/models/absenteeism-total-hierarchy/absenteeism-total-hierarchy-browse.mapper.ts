import { AbsenteeismTotalHierarchyBrowseModel } from '@/@v2/enterprise/absenteeism/domain/models/absenteeism-total-hierarchy/absenteeism-total-hierarchy-browse.model';
import { IPaginationModelMapper, PaginationModelMapper } from '@/@v2/shared/utils/database/pagination-mapper';
import { AbsenteeismTotalHierarchyResultBrowseModelMapper, IAbsenteeismTotalHierarchyResultBrowseModelMapper } from './absenteeism-total-hierarchy-browse-result.mapper';
import { AbsenteeismTotalHierarchyFilterBrowseModelMapper, IAbsenteeismTotalHierarchyFilterBrowseModelMapper } from './absenteeism-total-hierarchy-browse-filter.mapper';

export type IAbsenteeismTotalHierarchyBrowseModelMapper = {
  results: IAbsenteeismTotalHierarchyResultBrowseModelMapper[];
  pagination: IPaginationModelMapper;
  filters: IAbsenteeismTotalHierarchyFilterBrowseModelMapper;
};

export class AbsenteeismTotalHierarchyBrowseModelMapper {
  static toModel(prisma: IAbsenteeismTotalHierarchyBrowseModelMapper): AbsenteeismTotalHierarchyBrowseModel {
    return new AbsenteeismTotalHierarchyBrowseModel({
      results: AbsenteeismTotalHierarchyResultBrowseModelMapper.toModels(prisma.results),
      pagination: PaginationModelMapper.toModel(prisma.pagination),
      filters: AbsenteeismTotalHierarchyFilterBrowseModelMapper.toModel(prisma.filters),
    });
  }
}
