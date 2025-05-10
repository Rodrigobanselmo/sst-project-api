import { SubTypeBrowseModel } from '@/@v2/security/risk/domain/models/sub-type/sub-type-browse.model';
import { IPaginationModelMapper, PaginationModelMapper } from '@/@v2/shared/utils/database/pagination-mapper';
import { ISubTypeBrowseResultModelMapper, SubTypeBrowseResultModelMapper } from './sub-type-browse-result.mapper';

export type ISubTypeBrowseModelMapper = {
  results: ISubTypeBrowseResultModelMapper[];
  pagination: IPaginationModelMapper;
};

export class SubTypeBrowseModelMapper {
  static toModel(prisma: ISubTypeBrowseModelMapper): SubTypeBrowseModel {
    return new SubTypeBrowseModel({
      results: SubTypeBrowseResultModelMapper.toModels(prisma.results),
      pagination: PaginationModelMapper.toModel(prisma.pagination),
    });
  }
}
