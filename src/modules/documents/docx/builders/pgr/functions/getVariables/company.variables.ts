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
    [VariablesPGREnum.COMPANY_EMAIL]: company?.email || '',
    [VariablesPGREnum.COMPANY_NAME]: company?.name || '',
    [VariablesPGREnum.COMPANY_TELEPHONE]: company?.phone || '',
    [VariablesPGREnum.COMPANY_SHORT_NAME]: company?.shortName || '',
    [VariablesPGREnum.COMPANY_WORK_TIME]: company?.operationTime || '',
    [VariablesPGREnum.WORKSPACE_CNPJ]: workspace?.cnpj || '',
    [VariablesPGREnum.COMPANY_NUMBER]: address?.number || '',
    [VariablesPGREnum.COMPANY_CEP]: address?.cep || '',
    [VariablesPGREnum.COMPANY_STATE]: address?.state || '',
    [VariablesPGREnum.COMPANY_STREET]: address?.street || '',
    [VariablesPGREnum.COMPANY_CITY]: address?.city || '',
    [VariablesPGREnum.COMPANY_NEIGHBOR]: address?.neighborhood || '',
  };
};
