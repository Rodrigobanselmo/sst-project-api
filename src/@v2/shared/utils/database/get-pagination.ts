const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 20
const DEFAULT_OFFSET = 0
const MAX_LIMIT = 100


export function getPagination(page: number = DEFAULT_PAGE, limit: number = DEFAULT_LIMIT) {
  limit = getMaxLimit(limit)
  return { limit, offSet: getOffset(page, limit), page }
}

function getMaxLimit(limit: number): number {
  return limit > MAX_LIMIT ? MAX_LIMIT : limit
}

function getOffset(page: number, limit: number): number {
  if (!page) return DEFAULT_OFFSET

  return limit * (page - 1)
}