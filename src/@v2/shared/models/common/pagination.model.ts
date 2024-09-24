export class PaginationModel {
  total: number
  limit: number
  page: number

  constructor({ total, limit, page }: PaginationModel) {
    this.total = total
    this.limit = limit
    this.page = page
  }
}
