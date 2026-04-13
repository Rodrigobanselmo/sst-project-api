const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const DEFAULT_OFFSET = 0;
const MAX_LIMIT = 1000;

export function getPagination(
  page: number = DEFAULT_PAGE,
  limit: number = DEFAULT_LIMIT,
  maxLimit: number = MAX_LIMIT,
) {
  limit = getMaxLimit(limit, maxLimit);
  return { limit, offSet: getOffset(page, limit), page };
}

function getMaxLimit(limit: number, maxLimit: number): number {
  return limit > maxLimit ? maxLimit : limit;
}

function getOffset(page: number, limit: number): number {
  if (!page) return DEFAULT_OFFSET;

  return limit * (page - 1);
}
