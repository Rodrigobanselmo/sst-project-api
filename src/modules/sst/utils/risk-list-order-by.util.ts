import { Prisma } from '@prisma/client';

import { RiskListSortByEnum } from '../dto/risk.dto';

type RiskFactorsOrderBy = Prisma.RiskFactorsOrderByWithRelationInput[];

const defaultOrder: RiskFactorsOrderBy = [{ type: 'asc' }, { name: 'asc' }];

export function resolveRiskListOrderBy(
  listSortBy?: string,
  listSortOrder?: 'asc' | 'desc',
): RiskFactorsOrderBy {
  if (
    !listSortBy ||
    !listSortOrder ||
    (listSortOrder !== 'asc' && listSortOrder !== 'desc')
  ) {
    return defaultOrder;
  }

  const dir = listSortOrder;
  const tieName = { name: 'asc' as const };
  const tieId = { id: 'asc' as const };

  switch (listSortBy) {
    case RiskListSortByEnum.TYPE:
      return [{ type: dir }, tieName, tieId];
    case RiskListSortByEnum.NAME:
      return [{ name: dir }, tieId];
    case RiskListSortByEnum.SEVERITY:
      return [{ severity: dir }, tieName, tieId];
    case RiskListSortByEnum.STATUS:
      return [{ status: dir }, tieName, tieId];
    default:
      return defaultOrder;
  }
}
