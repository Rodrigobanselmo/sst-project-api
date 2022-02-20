import { WorkbooksEnum } from 'src/shared/constants/workbooks/workbooks.enum';
import { riskSheetConstant } from './sheets/risk/riskSheet.constant';

export const workbooksConstant = {
  [WorkbooksEnum.RISK]: {
    name: 'Fatores de riscos',
    id: WorkbooksEnum.RISK,
    sheets: riskSheetConstant,
  },
};
