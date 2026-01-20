import { WorkspaceModel } from '@/@v2/documents/domain/models/workspace.model';
import { VariablesPGREnum } from '../../enums/variables.enum';
import { CompanyModel } from '@/@v2/documents/domain/models/company.model';
import { formatCnpj } from '@/@v2/shared/utils/helpers/formats-cnpj';
import { formatPhoneNumber } from '@/@v2/shared/utils/helpers/formats-phone';
import { dateUtils } from '@/@v2/shared/utils/helpers/date-utils';

interface ICompanyVariables {
  company: CompanyModel;
  workspace: WorkspaceModel;
  employeeCount: number;
}

export const companyVariables = ({ employeeCount, company, workspace }: ICompanyVariables) => {
  // const address = workspace.isOwner ? workspace?.address || company?.address : company?.address;
  const address = company?.address;

  return {
    [VariablesPGREnum.CURRENT_DATE_LONG]: dateUtils().format('D [de] MMMM [de] YYYY [às] hh:mm').toLocaleLowerCase(),
    [VariablesPGREnum.CURRENT_DATE_SHORT]: dateUtils().format('DD/MM/YYYY').toLocaleLowerCase(),
    [VariablesPGREnum.CONSULTANT_NAME]: company.consultant?.name || company.name,
    [VariablesPGREnum.COMPANY_SIGNER_CITY]: (company.consultant ? company.consultant.address?.formattedCity : company.address?.formattedCity) || '',
    [VariablesPGREnum.COMPANY_CNAE]: company.primaryActivity,
    [VariablesPGREnum.COMPANY_RISK_DEGREE]: company.primaryActivityRiskDegree,
    [VariablesPGREnum.COMPANY_INITIAL]: company.initials ? `(${company.initials})` : '',
    [VariablesPGREnum.COMPANY_CNPJ]: formatCnpj(company?.cnpj) || '',
    [VariablesPGREnum.COMPANY_EMAIL]: company.email || '',
    [VariablesPGREnum.COMPANY_NAME]: company.name || '',
    [VariablesPGREnum.COMPANY_TELEPHONE]: formatPhoneNumber(company.phone) || '',
    [VariablesPGREnum.COMPANY_SHORT_NAME]: company.shortName || company.name || '',
    [VariablesPGREnum.COMPANY_WORK_TIME]: company.operationTime || '',
    [VariablesPGREnum.COMPANY_NUMBER]: address?.number || '',
    [VariablesPGREnum.COMPANY_CEP]: address?.cep || '',
    [VariablesPGREnum.COMPANY_STATE]: address?.state || '',
    [VariablesPGREnum.COMPANY_STREET]: address?.street || '',
    [VariablesPGREnum.COMPANY_CITY]: address?.city || '',
    [VariablesPGREnum.COMPANY_NEIGHBOR]: address?.neighborhood || '',
    [VariablesPGREnum.COMPANY_MISSION]: company.mission || '',
    [VariablesPGREnum.COMPANY_VISION]: company.vision || '',
    [VariablesPGREnum.COMPANY_VALUES]: company.values || '',
    [VariablesPGREnum.COMPANY_RESPONSIBLE]: company?.responsibleName || '',
    [VariablesPGREnum.WORKSPACE_CNPJ]: formatCnpj(workspace?.cnpj || company?.cnpj || ''),
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
    [VariablesPGREnum.COMPANY_EMPLOYEES_TOTAL]: String(employeeCount) || '',
  };
};
