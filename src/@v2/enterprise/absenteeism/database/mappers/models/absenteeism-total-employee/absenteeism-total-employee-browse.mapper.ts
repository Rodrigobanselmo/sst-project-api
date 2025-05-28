import { AbsenteeismTotalEmployeeBrowseModel } from '@/@v2/enterprise/absenteeism/domain/models/absenteeism-total-employee/absenteeism-total-employee-browse.model';
import { IPaginationModelMapper, PaginationModelMapper } from '@/@v2/shared/utils/database/pagination-mapper';
import { AbsenteeismTotalEmployeeResultBrowseModelMapper, IAbsenteeismTotalEmployeeResultBrowseModelMapper } from './absenteeism-total-employee-browse-result.mapper';

export type IAbsenteeismTotalEmployeeBrowseModelMapper = {
  results: IAbsenteeismTotalEmployeeResultBrowseModelMapper[];
  pagination: IPaginationModelMapper;
};

export class AbsenteeismTotalEmployeeBrowseModelMapper {
  static toModel(prisma: IAbsenteeismTotalEmployeeBrowseModelMapper): AbsenteeismTotalEmployeeBrowseModel {
    return new AbsenteeismTotalEmployeeBrowseModel({
      results: AbsenteeismTotalEmployeeResultBrowseModelMapper.toModels(prisma.results),
      pagination: PaginationModelMapper.toModel(prisma.pagination),
    });
  }
}
