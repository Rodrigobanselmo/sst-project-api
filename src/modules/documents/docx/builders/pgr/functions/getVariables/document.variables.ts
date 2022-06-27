import { CompanyEntity } from '../../../../../../company/entities/company.entity';
import { VariablesPGREnum } from '../../enums/variables.enum';

export const companyVariables = (company: CompanyEntity) => {
  return {
    [VariablesPGREnum.COMPANY_EMAIL]: company?.email || '',
  };
};
