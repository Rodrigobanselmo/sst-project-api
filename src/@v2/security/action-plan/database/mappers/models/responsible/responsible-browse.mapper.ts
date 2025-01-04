import { IPaginationModelMapper, PaginationModelMapper } from '@/@v2/shared/utils/database/pagination-mapper';
import { ResponsibleBrowseFilterModelMapper, IResponsibleBrowseFilterModelMapper } from './responsible-browse-filter.mapper';
import { ResponsibleBrowseResultModelMapper, IResponsibleBrowseResultModelMapper } from './responsible-browse-result.mapper';
import { ResponsibleBrowseModel } from '@/@v2/security/action-plan/domain/models/responsible/responsible-browse.model';

export type IResponsibleBrowseModelMapper = {
  results: IResponsibleBrowseResultModelMapper[]
  pagination: IPaginationModelMapper
  filters: IResponsibleBrowseFilterModelMapper
}

export class ResponsibleBrowseModelMapper {
  static toModel(prisma: IResponsibleBrowseModelMapper): ResponsibleBrowseModel {
    return new ResponsibleBrowseModel({
      results: ResponsibleBrowseResultModelMapper.toModels(prisma.results),
      pagination: PaginationModelMapper.toModel(prisma.pagination),
      filters: ResponsibleBrowseFilterModelMapper.toModel(prisma.filters),
    })
  }
}
