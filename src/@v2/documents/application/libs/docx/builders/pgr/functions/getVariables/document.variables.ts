import { CompanyModel } from '../../../../../../company/entities/company.entity';
import { VariablesPGREnum } from '../../enums/variables.enum';

export const companyVariables = (company: CompanyModel) => {
  return {
    [VariablesPGREnum.COMPANY_EMAIL]: company?.email || '',
  };
};
