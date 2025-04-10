import { FormApplicationBrowseFilterModel } from '@/@v2/forms/domain/models/form-application/form-application-browse-filter.model';

export type IFormApplicationBrowseFilterModelMapper = {
  filter_types: string[];
};

export class FormApplicationBrowseFilterModelMapper {
  static toModel(prisma: IFormApplicationBrowseFilterModelMapper): FormApplicationBrowseFilterModel {
    return new FormApplicationBrowseFilterModel({ types: prisma.filter_types });
  }
}
