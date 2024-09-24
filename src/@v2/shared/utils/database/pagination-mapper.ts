import { PaginationModel } from "../../models/common/pagination.model"

export type IPaginationModelMapper = {
  total: number
  limit: number
  page: number
}

export class PaginationModelMapper {
  static toModel(params: IPaginationModelMapper): PaginationModel {
    return new PaginationModel(params)
  }
}
