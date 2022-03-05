import { WorkbooksEnum } from 'src/shared/constants/workbooks/workbooks.enum';
import { companySheetConstant } from './sheets/company/companySheet.constant';
import { companyUniqueSheetConstant } from './sheets/companyUnique/companyUniqueSheet.constant';
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
};
