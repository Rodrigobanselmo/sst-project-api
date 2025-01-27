import { ResponsibleBrowseModel } from '@/@v2/security/action-plan/domain/models/responsible/responsible-browse.model';
import { IPaginationModelMapper, PaginationModelMapper } from '@/@v2/shared/utils/database/pagination-mapper';
import { IResponsibleBrowseResultModelMapper, ResponsibleBrowseResultModelMapper } from './responsible-browse-result.mapper';

export type IResponsibleBrowseModelMapper = {
  results: IResponsibleBrowseResultModelMapper[];
  pagination: IPaginationModelMapper;
};

export class ResponsibleBrowseModelMapper {
  static toModel(prisma: IResponsibleBrowseModelMapper): ResponsibleBrowseModel {
    return new ResponsibleBrowseModel({
      results: ResponsibleBrowseResultModelMapper.toModels(prisma.results),
      pagination: PaginationModelMapper.toModel(prisma.pagination),
    });
  }
}
