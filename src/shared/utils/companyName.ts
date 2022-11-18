import { CompanyEntity } from './../../modules/company/entities/company.entity';

export const getCompanyName = (company?: Partial<CompanyEntity>): string => {
  if (!company) return '';

  const initials = company?.initials ? `(${company?.initials})` : '';
  const name = company?.fantasy || company?.name || '';
  const companyName = (initials ? initials + ' ' : '') + name;

  return companyName;
};
