import { PaginationModel } from "@/@v2/shared/models/common/pagination.model";
import { CharacterizationBrowseFilterModel } from "./characterization-browse-filter.model";
import { CharacterizationBrowseResultModel } from "./characterization-browse-result.model";

export type ICharacterizationBrowseModel = {
  results: CharacterizationBrowseResultModel[]
  pagination: PaginationModel
  filters: CharacterizationBrowseFilterModel
}

export class CharacterizationBrowseModel {
  results: CharacterizationBrowseResultModel[]
  pagination: PaginationModel
  filters: CharacterizationBrowseFilterModel

  constructor(params: ICharacterizationBrowseModel) {
    this.results = params.results
    this.pagination = params.pagination
    this.filters = params.filters
  }
}