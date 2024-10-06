import { CharacterizationBrowseModel } from '@/@v2/security/domain/models/characterization-browse.model';
import { IPaginationModelMapper, PaginationModelMapper } from '@/@v2/shared/utils/database/pagination-mapper';
import { CharacterizationBrowseFilterModelMapper, ICharacterizationBrowseFilterModelMapper } from './characterization-browse-filter.mapper';
import { CharacterizationBrowseResultModelMapper, ICharacterizationBrowseResultModelMapper } from './characterization-browse-result.mapper';

export type ICharacterizationBrowseModelMapper = {
  results: ICharacterizationBrowseResultModelMapper[]
  pagination: IPaginationModelMapper
  filters: ICharacterizationBrowseFilterModelMapper
}

export class CharacterizationBrowseModelMapper {
  static toModel(prisma: ICharacterizationBrowseModelMapper): CharacterizationBrowseModel {
    return new CharacterizationBrowseModel({
      results: CharacterizationBrowseResultModelMapper.toModels(prisma.results),
      pagination: PaginationModelMapper.toModel(prisma.pagination),
      filters: CharacterizationBrowseFilterModelMapper.toModel(prisma.filters),
    })
  }
}
