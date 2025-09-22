import { PaginationModel } from '@/@v2/shared/models/common/pagination.model';
import { FormParticipantsBrowseResultModel } from './form-participants-browse-result.model';

export type IFormParticipantsBrowseModel = {
  pagination: PaginationModel;
  results: FormParticipantsBrowseResultModel[];
};

export class FormParticipantsBrowseModel {
  results: FormParticipantsBrowseResultModel[];
  pagination: PaginationModel;

  constructor(params: IFormParticipantsBrowseModel) {
    this.results = params.results;
    this.pagination = params.pagination;
  }
}
