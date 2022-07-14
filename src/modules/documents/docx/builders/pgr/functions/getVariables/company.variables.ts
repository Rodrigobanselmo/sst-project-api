import { WorkspaceEntity } from '../../../../../../company/entities/workspace.entity';
import { AddressEntity } from '../../../../../../company/entities/address.entity';
import { CompanyEntity } from '../../../../../../company/entities/company.entity';
import { VariablesPGREnum } from '../../enums/variables.enum';

export const companyVariables = (
  company: CompanyEntity,
  workspace: WorkspaceEntity,
  address: AddressEntity,
) => {
  return {
    [VariablesPGREnum.COMPANY_CNAE]: company?.primary_activity
      ? `${company?.primary_activity[0].code} – ${company?.primary_activity[0].name}`
      : '',
    [VariablesPGREnum.COMPANY_RISK_DEGREE]:
      company?.primary_activity && company?.primary_activity[0]
        ? String(company?.primary_activity[0].riskDegree)
        : '',
    [VariablesPGREnum.COMPANY_EMAIL]: company?.email || '',
    [VariablesPGREnum.COMPANY_NAME]: company?.name || '',
    [VariablesPGREnum.COMPANY_TELEPHONE]: company?.phone || '',
    [VariablesPGREnum.COMPANY_SHORT_NAME]:
      company?.shortName || company?.name || '',
    [VariablesPGREnum.COMPANY_WORK_TIME]: company?.operationTime || '',
    [VariablesPGREnum.COMPANY_NUMBER]: address?.number || '',
    [VariablesPGREnum.COMPANY_CEP]: address?.cep || '',
    [VariablesPGREnum.COMPANY_STATE]: address?.state || '',
    [VariablesPGREnum.COMPANY_STREET]: address?.street || '',
    [VariablesPGREnum.COMPANY_CITY]: address?.city || '',
    [VariablesPGREnum.COMPANY_NEIGHBOR]: address?.neighborhood || '',
    [VariablesPGREnum.COMPANY_MISSION]: company?.mission || '',
    [VariablesPGREnum.COMPANY_VISION]: company?.vision || '',
    [VariablesPGREnum.COMPANY_VALUES]: company?.values || '',
    [VariablesPGREnum.COMPANY_RESPONSIBLE]: company?.responsibleName || '',
    [VariablesPGREnum.WORKSPACE_CNPJ]: workspace?.cnpj || '',
    [VariablesPGREnum.IS_RS]: address?.state === 'RS' ? 'true' : '',
    [VariablesPGREnum.COMPANY_EMPLOYEES_TOTAL]:
      String(company?.employeeCount) || '',
  };
};
