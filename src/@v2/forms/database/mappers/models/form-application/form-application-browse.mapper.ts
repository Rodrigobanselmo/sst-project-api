import { IPaginationModelMapper, PaginationModelMapper } from '@/@v2/shared/utils/database/pagination-mapper';
import { FormApplicationBrowseFilterModelMapper, IFormApplicationBrowseFilterModelMapper } from './form-application-browse-filter.mapper';
import { FormApplicationBrowseResultModelMapper, IFormApplicationBrowseResultModelMapper } from './form-application-browse-result.mapper';
import { FormApplicationBrowseModel } from '@/@v2/forms/domain/models/form-application/form-application-browse.model';

export type IFormApplicationBrowseModelMapper = {
  results: IFormApplicationBrowseResultModelMapper[];
  filters: IFormApplicationBrowseFilterModelMapper;
  pagination: IPaginationModelMapper;
};

export class FormApplicationBrowseModelMapper {
  static toModel(prisma: IFormApplicationBrowseModelMapper): FormApplicationBrowseModel {
    return new FormApplicationBrowseModel({
      results: FormApplicationBrowseResultModelMapper.toModels(prisma.results),
      filters: FormApplicationBrowseFilterModelMapper.toModel(prisma.filters),
      pagination: PaginationModelMapper.toModel(prisma.pagination),
    });
  }
}
