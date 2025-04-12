import { FormStatusEnum } from '@/@v2/forms/domain/enums/form-status.enum';
import { FormApplicationBrowseFilterModel } from '@/@v2/forms/domain/models/form-application/form-application-browse-filter.model';

export type IFormApplicationBrowseFilterModelMapper = {
  filter_status: string[];
};

export class FormApplicationBrowseFilterModelMapper {
  static toModel(prisma: IFormApplicationBrowseFilterModelMapper): FormApplicationBrowseFilterModel {
    return new FormApplicationBrowseFilterModel({ status: prisma.filter_status.map((status) => FormStatusEnum[status]) });
  }
}
