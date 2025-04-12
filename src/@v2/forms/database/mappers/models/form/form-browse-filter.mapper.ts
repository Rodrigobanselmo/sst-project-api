import { FormTypeEnum } from '@/@v2/forms/domain/enums/form-type.enum';
import { FormBrowseFilterModel } from '@/@v2/forms/domain/models/form/form-browse-filter.model';

export type IFormBrowseFilterModelMapper = {
  filter_types: string[];
};

export class FormBrowseFilterModelMapper {
  static toModel(prisma: IFormBrowseFilterModelMapper): FormBrowseFilterModel {
    return new FormBrowseFilterModel({ types: prisma.filter_types.map((type) => FormTypeEnum[type]) });
  }
}
