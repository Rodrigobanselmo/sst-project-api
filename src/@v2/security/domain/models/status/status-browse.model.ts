import { StatusBrowseResultModel } from "./status-browse-result.model";

export type IStatusBrowseModel = {
  results: StatusBrowseResultModel[]
}

export class StatusBrowseModel {
  results: StatusBrowseResultModel[]

  constructor(params: IStatusBrowseModel) {
    this.results = params.results
  }
}