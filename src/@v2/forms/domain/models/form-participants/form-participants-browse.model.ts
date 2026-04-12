import { PaginationModel } from '@/@v2/shared/models/common/pagination.model';
import { FormParticipantsBrowseResultModel } from './form-participants-browse-result.model';

export type IFormParticipantsFilterSummary = {
  totalParticipants: number;
  respondedCount: number;
  notRespondedCount: number;
  responseRatePercent: number;
};

export type IFormParticipantsBrowseModel = {
  pagination: PaginationModel;
  results: FormParticipantsBrowseResultModel[];
  filterSummary: IFormParticipantsFilterSummary;
};

export class FormParticipantsBrowseModel {
  results: FormParticipantsBrowseResultModel[];
  pagination: PaginationModel;
  filterSummary: IFormParticipantsFilterSummary;

  constructor(params: IFormParticipantsBrowseModel) {
    this.results = params.results;
    this.pagination = params.pagination;
    this.filterSummary = params.filterSummary;
  }
}
