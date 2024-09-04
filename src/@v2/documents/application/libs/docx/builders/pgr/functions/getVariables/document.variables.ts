import { CompanyModel } from '@/@v2/documents/domain/models/company.model';
import { VariablesPGREnum } from '../../enums/variables.enum';

export const companyVariables = (company: CompanyModel) => {
  return {
    [VariablesPGREnum.COMPANY_EMAIL]: company?.email || '',
  };
};
