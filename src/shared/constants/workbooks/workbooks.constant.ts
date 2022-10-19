import { WorkbooksEnum } from '../../../shared/constants/workbooks/workbooks.enum';
import { cidSheetConstant } from './sheets/cid/cidSheet.constant';
import { cnaeSheetConstant } from './sheets/cnae/cnaeSheet.constant';
import { companySheetConstant } from './sheets/company/companySheet.constant';
import { companyUniqueSheetConstant } from './sheets/companyUnique/companyUniqueSheet.constant';
import { employeesSheetConstant } from './sheets/employees/employeesSheet.constant';
import { epiSheetConstant } from './sheets/epi/epiSheet.constant';
import { hierarchiesSheetConstant } from './sheets/hierarchies/hierarchiesSheet.constant';
import { riskSheetConstant } from './sheets/risk/riskSheet.constant';

export const workbooksConstant = {
  [WorkbooksEnum.RISK]: {
    name: 'Fatores de riscos',
    id: WorkbooksEnum.RISK,
    sheets: riskSheetConstant,
    path: 'files/checklist',
  },
  [WorkbooksEnum.COMPANIES]: {
    name: 'Empresas',
    id: WorkbooksEnum.COMPANIES,
    sheets: companySheetConstant,
    path: 'files/company',
  },
  [WorkbooksEnum.COMPANY]: {
    name: 'Empresa',
    id: WorkbooksEnum.COMPANY,
    sheets: companyUniqueSheetConstant,
  },
  [WorkbooksEnum.EPI]: {
    name: 'EPI',
    id: WorkbooksEnum.EPI,
    sheets: epiSheetConstant,
    path: 'files/checklist/epi',
  },
  [WorkbooksEnum.EMPLOYEES]: {
    name: 'Empregados',
    id: WorkbooksEnum.EMPLOYEES,
    sheets: employeesSheetConstant,
    path: 'files/company/employees',
  },
  [WorkbooksEnum.HIERARCHIES]: {
    name: 'Organograma',
    id: WorkbooksEnum.HIERARCHIES,
    sheets: hierarchiesSheetConstant,
    path: 'files/company/hierarchies',
  },
  [WorkbooksEnum.CNAE]: {
    name: 'CNAE',
    id: WorkbooksEnum.CNAE,
    sheets: cnaeSheetConstant,
    path: 'files/cnae',
  },
  [WorkbooksEnum.CID]: {
    name: 'CID',
    id: WorkbooksEnum.CID,
    sheets: cidSheetConstant,
    path: 'files/cid',
  },
};
