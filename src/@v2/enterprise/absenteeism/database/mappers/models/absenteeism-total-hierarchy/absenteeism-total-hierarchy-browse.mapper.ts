import { AbsenteeismTotalHierarchyBrowseModel } from '@/@v2/enterprise/absenteeism/domain/models/absenteeism-total-hierarchy/absenteeism-total-hierarchy-browse.model';
import { IPaginationModelMapper, PaginationModelMapper } from '@/@v2/shared/utils/database/pagination-mapper';
import { AbsenteeismTotalHierarchyResultBrowseModelMapper, IAbsenteeismTotalHierarchyResultBrowseModelMapper } from './absenteeism-total-hierarchy-browse-result.mapper';
import { AbsenteeismTotalHierarchyFilterBrowseModelMapper, IAbsenteeismTotalHierarchyFilterBrowseModelMapper } from './absenteeism-total-hierarchy-browse-filter.mapper';

export type IAbsenteeismTotalHierarchyBrowseModelMapper = {
  results: IAbsenteeismTotalHierarchyResultBrowseModelMapper[];
  pagination: IPaginationModelMapper;
  filters: IAbsenteeismTotalHierarchyFilterBrowseModelMapper;
  range: { startDate?: Date; endDate?: Date };
};

export class AbsenteeismTotalHierarchyBrowseModelMapper {
  static toModel(prisma: IAbsenteeismTotalHierarchyBrowseModelMapper): AbsenteeismTotalHierarchyBrowseModel {
    const daysInRange = (prisma.range.endDate?.getTime() - prisma.range.startDate?.getTime()) / (1000 * 60 * 60 * 24) + 1;

    return new AbsenteeismTotalHierarchyBrowseModel({
      results: AbsenteeismTotalHierarchyResultBrowseModelMapper.toModels(prisma.results, daysInRange),
      pagination: PaginationModelMapper.toModel(prisma.pagination),
      filters: AbsenteeismTotalHierarchyFilterBrowseModelMapper.toModel(prisma.filters),
    });
  }
}
