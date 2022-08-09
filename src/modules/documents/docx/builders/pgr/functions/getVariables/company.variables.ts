import { WorkspaceEntity } from '../../../../../../company/entities/workspace.entity';
import { AddressEntity } from '../../../../../../company/entities/address.entity';
import { CompanyEntity } from '../../../../../../company/entities/company.entity';
import { VariablesPGREnum } from '../../enums/variables.enum';
import { formatCNPJ } from '@brazilian-utils/brazilian-utils';
import {
  formatCnae,
  formatPhoneNumber,
} from '../../../../../../../shared/utils/formats';

export const companyVariables = (
  company: CompanyEntity,
  workspace: WorkspaceEntity,
  address: AddressEntity,
) => {
  const consultant =
    company.receivingServiceContracts[0]?.applyingServiceCompany;

  return {
    [VariablesPGREnum.CONSULTANT_NAME]: consultant
      ? `${consultant.name} `
      : `${company.name}`,
    [VariablesPGREnum.COMPANY_SIGNER_CITY]: consultant
      ? `${consultant.address.city} – ${consultant.address.state}`
      : `${company.address.city} – ${company.address.state}`,
    [VariablesPGREnum.COMPANY_CNAE]: company?.primary_activity
      ? `${formatCnae(company?.primary_activity[0].code)} – ${
          company?.primary_activity[0].name
        }`
      : '',
    [VariablesPGREnum.COMPANY_RISK_DEGREE]:
      company?.primary_activity && company?.primary_activity[0]
        ? String(company?.primary_activity[0].riskDegree)
        : '',
    [VariablesPGREnum.COMPANY_INITIAL]: `(${company?.initials})` || '',
    [VariablesPGREnum.COMPANY_CNPJ]: formatCNPJ(company?.cnpj) || '',
    [VariablesPGREnum.COMPANY_EMAIL]: company?.email || '',
    [VariablesPGREnum.COMPANY_NAME]: company?.name || '',
    [VariablesPGREnum.COMPANY_TELEPHONE]:
      formatPhoneNumber(company?.phone) || '',
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
    [VariablesPGREnum.WORKSPACE_CNPJ]:
      formatCNPJ(workspace?.cnpj) || formatCNPJ(company?.cnpj) || '',
    [VariablesPGREnum.IS_RS]: address?.state === 'RS' ? 'true' : '',
    [VariablesPGREnum.COMPANY_EMPLOYEES_TOTAL]:
      String(company?.employeeCount) || '',
  };
};
