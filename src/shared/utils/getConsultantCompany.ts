import { CompanyEntity } from './../../modules/company/entities/company.entity';

export const getConsultantCompany = (company: CompanyEntity): CompanyEntity => {
  if (!company.receivingServiceContracts?.length) {
    return;
  }

  return company.receivingServiceContracts.find((consult) => !consult?.applyingServiceCompany?.isGroup)
    ?.applyingServiceCompany;
};
