import { IPaginationModelMapper, PaginationModelMapper } from '@/@v2/shared/utils/database/pagination-mapper';
import { FormBrowseFilterModelMapper, IFormBrowseFilterModelMapper } from './form-browse-filter.mapper';
import { FormBrowseResultModelMapper, IFormBrowseResultModelMapper } from './form-browse-result.mapper';
import { FormBrowseModel } from '@/@v2/forms/domain/models/form/form-browse.model';

export type IFormBrowseModelMapper = {
  results: IFormBrowseResultModelMapper[];
  filters: IFormBrowseFilterModelMapper;
  pagination: IPaginationModelMapper;
};

export class FormBrowseModelMapper {
  static toModel(prisma: IFormBrowseModelMapper): FormBrowseModel {
    return new FormBrowseModel({
      results: FormBrowseResultModelMapper.toModels(prisma.results),
      filters: FormBrowseFilterModelMapper.toModel(prisma.filters),
      pagination: PaginationModelMapper.toModel(prisma.pagination),
    });
  }
}
