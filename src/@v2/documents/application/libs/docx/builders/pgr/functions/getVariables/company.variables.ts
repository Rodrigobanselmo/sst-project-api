import { WorkspaceEntity } from '../../../../../../company/entities/workspace.entity';
import { AddressEntity } from '../../../../../../company/entities/address.entity';
import { CompanyEntity } from '../../../../../../company/entities/company.entity';
import { VariablesPGREnum } from '../../enums/variables.enum';
import { formatCNPJ } from '@brazilian-utils/brazilian-utils';
import { formatCnae, formatPhoneNumber } from '../../../../../../../shared/utils/formats';

export const companyVariables = (company: CompanyEntity, workspace: WorkspaceEntity, address: AddressEntity) => {
  const consultant = company.receivingServiceContracts[0]?.applyingServiceCompany;

  return {
    [VariablesPGREnum.CONSULTANT_NAME]: consultant ? `${consultant.name} ` : `${company.name}`,
    [VariablesPGREnum.COMPANY_SIGNER_CITY]: consultant
      ? `${consultant.address.city} – ${consultant.address.state}`
      : `${company.address.city} – ${company.address.state}`,
    [VariablesPGREnum.COMPANY_CNAE]: company?.primary_activity
      ? `${formatCnae(company?.primary_activity[0]?.code || '')} – ${company?.primary_activity[0]?.name || ''}`
      : '',
    [VariablesPGREnum.COMPANY_RISK_DEGREE]:
      company?.primary_activity && company?.primary_activity[0] ? String(company?.primary_activity[0].riskDegree) : '',
    [VariablesPGREnum.COMPANY_INITIAL]: `(${company?.initials})` || '',
    [VariablesPGREnum.COMPANY_CNPJ]: formatCNPJ(company?.cnpj) || '',
    [VariablesPGREnum.COMPANY_EMAIL]: company?.email || '',
    [VariablesPGREnum.COMPANY_NAME]: company?.name || '',
    [VariablesPGREnum.COMPANY_TELEPHONE]: formatPhoneNumber(company?.phone) || '',
    [VariablesPGREnum.COMPANY_SHORT_NAME]: company?.shortName || company?.name || '',
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
    [VariablesPGREnum.WORKSPACE_CNPJ]: formatCNPJ(workspace?.cnpj) || formatCNPJ(company?.cnpj) || '',
    [VariablesPGREnum.IS_RS]: address?.state === 'RS' ? 'true' : '',
    [VariablesPGREnum.IS_AC]: address?.state == 'AC' ? 'true' : '',
    [VariablesPGREnum.IS_AL]: address?.state == 'AL' ? 'true' : '',
    [VariablesPGREnum.IS_AP]: address?.state == 'AP' ? 'true' : '',
    [VariablesPGREnum.IS_AM]: address?.state == 'AM' ? 'true' : '',
    [VariablesPGREnum.IS_BA]: address?.state == 'BA' ? 'true' : '',
    [VariablesPGREnum.IS_CE]: address?.state == 'CE' ? 'true' : '',
    [VariablesPGREnum.IS_DF]: address?.state == 'DF' ? 'true' : '',
    [VariablesPGREnum.IS_ES]: address?.state == 'ES' ? 'true' : '',
    [VariablesPGREnum.IS_GO]: address?.state == 'GO' ? 'true' : '',
    [VariablesPGREnum.IS_MA]: address?.state == 'MA' ? 'true' : '',
    [VariablesPGREnum.IS_MS]: address?.state == 'MS' ? 'true' : '',
    [VariablesPGREnum.IS_MT]: address?.state == 'MT' ? 'true' : '',
    [VariablesPGREnum.IS_MG]: address?.state == 'MG' ? 'true' : '',
    [VariablesPGREnum.IS_PA]: address?.state == 'PA' ? 'true' : '',
    [VariablesPGREnum.IS_PB]: address?.state == 'PB' ? 'true' : '',
    [VariablesPGREnum.IS_PR]: address?.state == 'PR' ? 'true' : '',
    [VariablesPGREnum.IS_PE]: address?.state == 'PE' ? 'true' : '',
    [VariablesPGREnum.IS_PI]: address?.state == 'PI' ? 'true' : '',
    [VariablesPGREnum.IS_RJ]: address?.state == 'RJ' ? 'true' : '',
    [VariablesPGREnum.IS_RN]: address?.state == 'RN' ? 'true' : '',
    [VariablesPGREnum.IS_RO]: address?.state == 'RO' ? 'true' : '',
    [VariablesPGREnum.IS_RR]: address?.state == 'RR' ? 'true' : '',
    [VariablesPGREnum.IS_SC]: address?.state == 'SC' ? 'true' : '',
    [VariablesPGREnum.IS_SP]: address?.state == 'SP' ? 'true' : '',
    [VariablesPGREnum.IS_SE]: address?.state == 'SE' ? 'true' : '',
    [VariablesPGREnum.IS_TO]: address?.state == 'TO' ? 'true' : '',
    [VariablesPGREnum.COMPANY_EMPLOYEES_TOTAL]: String(company?.employeeCount) || '',
  };
};
