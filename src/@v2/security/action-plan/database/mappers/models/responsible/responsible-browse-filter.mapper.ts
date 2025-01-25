import { ResponsibleBrowseFilterModel } from '@/@v2/security/action-plan/domain/models/responsible/responsible-browse-filter.model';

export type IResponsibleBrowseFilterModelMapper = {};

export class ResponsibleBrowseFilterModelMapper {
  static toModel(): ResponsibleBrowseFilterModel {
    return new ResponsibleBrowseFilterModel({});
  }
}
