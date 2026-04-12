import { Prisma } from '@prisma/client';

import { AbsenteeismListSortByEnum } from '../dto/absenteeism-list-sort.enum';

export function resolveAbsenteeismListOrderBy(
  listSortBy?: AbsenteeismListSortByEnum,
  listSortOrder?: 'asc' | 'desc',
): Prisma.AbsenteeismOrderByWithRelationInput | Prisma.AbsenteeismOrderByWithRelationInput[] {
  const order = listSortOrder === 'desc' ? 'desc' : 'asc';

  if (!listSortBy) {
    return { startDate: 'desc' };
  }

  const tieBreaker: Prisma.AbsenteeismOrderByWithRelationInput = { id: 'asc' };

  switch (listSortBy) {
    case AbsenteeismListSortByEnum.EMPLOYEE_NAME:
      return [{ employee: { name: order } }, tieBreaker];
    case AbsenteeismListSortByEnum.COMPANY_NAME:
      return [{ employee: { company: { name: order } } }, tieBreaker];
    case AbsenteeismListSortByEnum.MOTIVE_DESC:
      return [{ motive: { desc: order } }, tieBreaker];
    case AbsenteeismListSortByEnum.START_DATE:
      return [{ startDate: order }, tieBreaker];
    case AbsenteeismListSortByEnum.TIME_SPENT:
      return [{ timeSpent: order }, tieBreaker];
    default:
      return { startDate: 'desc' };
  }
}
