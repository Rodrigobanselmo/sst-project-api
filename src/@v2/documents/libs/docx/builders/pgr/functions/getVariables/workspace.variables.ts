import { CompanyModel } from '@/@v2/documents/domain/models/company.model';
import { WorkspaceModel } from '@/@v2/documents/domain/models/workspace.model';
import { formatCnae } from '@/@v2/shared/utils/helpers/formats-cnae';
import { formatCnpj } from '@/@v2/shared/utils/helpers/formats-cnpj';

import { VariablesPGREnum } from '../../enums/variables.enum';

const formatWorkspaceCnae = (workspace: WorkspaceModel): string => {
  if (workspace.cnaeCode && workspace.cnaeLabel) {
    const code = workspace.cnaeCode.includes('-')
      ? workspace.cnaeCode
      : formatCnae(workspace.cnaeCode);

    return `${code} – ${workspace.cnaeLabel}`;
  }

  return workspace.cnaeLabel || workspace.cnaeCode || '';
};

export const workspaceVariables = (
  workspace: WorkspaceModel,
  company?: CompanyModel,
) => {
  const address = workspace?.address;

  return {
    [VariablesPGREnum.WORKSPACE_CNPJ]: formatCnpj(workspace?.cnpj || company?.cnpj || ''),
    [VariablesPGREnum.WORKSPACE_NAME]: workspace?.name || '',
    [VariablesPGREnum.WORKSPACE_LEGAL_NAME]:
      workspace?.razaoSocial || workspace?.name || '',
    [VariablesPGREnum.WORKSPACE_STREET]: address?.street || '',
    [VariablesPGREnum.WORKSPACE_NUMBER]: address?.number || '',
    [VariablesPGREnum.WORKSPACE_NEIGHBOR]: address?.neighborhood || '',
    [VariablesPGREnum.WORKSPACE_CITY]: address?.city || '',
    [VariablesPGREnum.WORKSPACE_STATE]: address?.state || '',
    [VariablesPGREnum.WORKSPACE_CEP]: address?.cep || '',
    [VariablesPGREnum.WORKSPACE_INITIAL]: workspace?.abbreviation || '',
    [VariablesPGREnum.WORKSPACE_CNAE]: formatWorkspaceCnae(workspace),
    [VariablesPGREnum.WORKSPACE_RISK_DEGREE]:
      workspace?.riskDegree != null ? String(workspace.riskDegree) : '',
    [VariablesPGREnum.WORKSPACE_WORK_TIME]: workspace?.workSchedule || '',
  };
};
