import { ITableSchema } from '../../../../providers/ExcelProvider/models/IExcelProvider.types';
import { cnaeColumnsConstant } from './cnaeColumns.constant';

import { CnaeSheetEnum } from './cnaeSheet.enum';

export interface ICnaeSheet {
  name: string;
  id: CnaeSheetEnum;
  columns: ITableSchema[];
}

export const cnaeSheetConstant = {
  [CnaeSheetEnum.CNAE]: {
    name: 'CNAE',
    id: CnaeSheetEnum.CNAE,
    columns: cnaeColumnsConstant,
  },
} as Record<CnaeSheetEnum, ICnaeSheet>;
