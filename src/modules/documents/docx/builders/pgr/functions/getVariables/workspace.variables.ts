import { WorkspaceEntity } from '../../../../../../company/entities/workspace.entity';
import { CompanyEntity } from '../../../../../../company/entities/company.entity';
import { VariablesPGREnum } from '../../enums/variables.enum';
import { formatCNPJ } from '@brazilian-utils/brazilian-utils';
import { formatCnae } from '../../../../../../../shared/utils/formats';

export const safeFormatCNPJ = (value?: string | null) =>
  value ? formatCNPJ(value) || '' : '';

const getWorkspaceCompanyJson = (workspace: WorkspaceEntity) =>
  (workspace?.companyJson as Record<string, any>) || {};

const formatWorkspaceCnae = (workspace: WorkspaceEntity): string => {
  const json = getWorkspaceCompanyJson(workspace);
  const primaryActivity =
    json.primary_activity?.[0] || json.primaryActivity || null;

  const cnaeLabel =
    primaryActivity?.name || json.primaryActivity?.name || '';
  const cnaeCode =
    primaryActivity?.code || json.primaryActivity?.code || '';

  if (cnaeCode && cnaeLabel) {
    const code = String(cnaeCode).includes('-')
      ? String(cnaeCode)
      : formatCnae(String(cnaeCode));

    return `${code} – ${cnaeLabel}`;
  }

  return cnaeLabel || cnaeCode || '';
};

export const workspaceVariables = (
  workspace: WorkspaceEntity,
  company?: CompanyEntity,
) => {
  const json = getWorkspaceCompanyJson(workspace);
  const address = workspace?.address;
  const primaryActivity =
    json.primary_activity?.[0] || json.primaryActivity || null;
  const riskDegree =
    primaryActivity?.riskDegree ?? json.primaryActivity?.riskDegree;

  return {
    [VariablesPGREnum.WORKSPACE_CNPJ]:
      safeFormatCNPJ(workspace?.cnpj) || safeFormatCNPJ(company?.cnpj) || '',
    [VariablesPGREnum.WORKSPACE_NAME]: workspace?.name || '',
    [VariablesPGREnum.WORKSPACE_LEGAL_NAME]:
      json.name || workspace?.name || '',
    [VariablesPGREnum.WORKSPACE_STREET]: address?.street || '',
    [VariablesPGREnum.WORKSPACE_NUMBER]: address?.number || '',
    [VariablesPGREnum.WORKSPACE_NEIGHBOR]: address?.neighborhood || '',
    [VariablesPGREnum.WORKSPACE_CITY]: address?.city || '',
    [VariablesPGREnum.WORKSPACE_STATE]: address?.state || '',
    [VariablesPGREnum.WORKSPACE_CEP]: address?.cep || '',
    [VariablesPGREnum.WORKSPACE_INITIAL]: workspace?.abbreviation || '',
    [VariablesPGREnum.WORKSPACE_CNAE]: formatWorkspaceCnae(workspace),
    [VariablesPGREnum.WORKSPACE_RISK_DEGREE]:
      riskDegree != null ? String(riskDegree) : '',
    [VariablesPGREnum.WORKSPACE_WORK_TIME]: json.workSchedule || '',
  };
};
