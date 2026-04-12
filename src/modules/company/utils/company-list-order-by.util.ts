import { Prisma } from '@prisma/client';

import { CompanyListSortByEnum } from '../dto/company-list-sort.enum';

/** Default matches previous behavior: status then name. */
export function resolveCompanyListOrderBy(
  listSortBy?: CompanyListSortByEnum,
  listSortOrder?: 'asc' | 'desc',
): Prisma.CompanyOrderByWithRelationInput | Prisma.CompanyOrderByWithRelationInput[] {
  const order = listSortOrder === 'desc' ? 'desc' : 'asc';

  if (!listSortBy) {
    return [{ status: 'asc' }, { name: 'asc' }];
  }

  const tieBreaker: Prisma.CompanyOrderByWithRelationInput = { id: 'asc' };

  switch (listSortBy) {
    case CompanyListSortByEnum.NAME:
      return [{ name: order }, tieBreaker];
    case CompanyListSortByEnum.FANTASY:
      return [{ fantasy: order }, tieBreaker];
    case CompanyListSortByEnum.GROUP_NAME:
      return [{ group: { name: order } }, tieBreaker];
    case CompanyListSortByEnum.CNPJ:
      return [{ cnpj: order }, tieBreaker];
    case CompanyListSortByEnum.ADDRESS_STREET:
      return [{ address: { street: order } }, tieBreaker];
    case CompanyListSortByEnum.CITY:
      return [{ address: { city: order } }, tieBreaker];
    case CompanyListSortByEnum.STATE:
      return [{ address: { state: order } }, tieBreaker];
    case CompanyListSortByEnum.PHONE:
      return [{ phone: order }, tieBreaker];
    case CompanyListSortByEnum.STATUS:
      return [{ status: order }, tieBreaker];
    default:
      return [{ status: 'asc' }, { name: 'asc' }];
  }
}
