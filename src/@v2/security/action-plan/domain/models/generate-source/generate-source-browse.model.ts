import { PaginationModel } from '@/@v2/shared/models/common/pagination.model';
import { GenerateSourceBrowseResultModel } from './generate-source-browse-result.model';

export type IGenerateSourceBrowseModel = {
  results: GenerateSourceBrowseResultModel[];
  pagination: PaginationModel;
};

export class GenerateSourceBrowseModel {
  results: GenerateSourceBrowseResultModel[];
  pagination: PaginationModel;

  constructor(params: IGenerateSourceBrowseModel) {
    this.results = params.results;
    this.pagination = params.pagination;
  }
}
