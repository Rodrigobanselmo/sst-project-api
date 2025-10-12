import { GenerateSourceBrowseModel } from '@/@v2/security/action-plan/domain/models/generate-source/generate-source-browse.model';
import { IPaginationModelMapper, PaginationModelMapper } from '@/@v2/shared/utils/database/pagination-mapper';
import { GenerateSourceBrowseResultModelMapper, IGenerateSourceBrowseResultModelMapper } from './generate-source-browse-result.mapper';

export type IGenerateSourceBrowseModelMapper = {
  results: IGenerateSourceBrowseResultModelMapper[];
  pagination: IPaginationModelMapper;
};

export class GenerateSourceBrowseModelMapper {
  static toModel(prisma: IGenerateSourceBrowseModelMapper): GenerateSourceBrowseModel {
    return new GenerateSourceBrowseModel({
      results: GenerateSourceBrowseResultModelMapper.toModels(prisma.results),
      pagination: PaginationModelMapper.toModel(prisma.pagination),
    });
  }
}
