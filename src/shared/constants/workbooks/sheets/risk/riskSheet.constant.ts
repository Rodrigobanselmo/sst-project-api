import { RiskFactorsEnum } from '@prisma/client';
import { ITableSchema } from '../../../../../shared/providers/ExcelProvider/models/IExcelProvider.types';
import { riskColumnsConstant } from './riskColumns.constant';
import { RiskSheetEnum } from './riskSheet.enum';

export interface IRiskSheet {
  name: string;
  id: RiskSheetEnum;
  columns: ITableSchema[];
  type: RiskFactorsEnum;
}

export const riskSheetConstant = {
  [RiskSheetEnum.PHYSICAL_RISK]: {
    name: 'Riscos físicos',
    type: RiskFactorsEnum.FIS,
    id: RiskSheetEnum.PHYSICAL_RISK,
    columns: riskColumnsConstant,
  },
  [RiskSheetEnum.CHEMICAL_RISK]: {
    name: 'Riscos químicos',
    type: RiskFactorsEnum.QUI,
    id: RiskSheetEnum.CHEMICAL_RISK,
    columns: riskColumnsConstant,
  },
  [RiskSheetEnum.BIOLOGICAL_RISK]: {
    name: 'Riscos bilógicos',
    type: RiskFactorsEnum.BIO,
    id: RiskSheetEnum.BIOLOGICAL_RISK,
    columns: riskColumnsConstant,
  },
  [RiskSheetEnum.ACCIDENT_RISK]: {
    name: 'Riscos de acidente',
    type: RiskFactorsEnum.ACI,
    id: RiskSheetEnum.ACCIDENT_RISK,
    columns: riskColumnsConstant,
  },
  [RiskSheetEnum.ERGONOMIC_RISK]: {
    name: 'Riscos ergonômicos',
    type: RiskFactorsEnum.ERG,
    id: RiskSheetEnum.ERGONOMIC_RISK,
    columns: riskColumnsConstant,
  },
} as Record<RiskSheetEnum, IRiskSheet>;
