import { ITableSchema } from '../../../../providers/ExcelProvider/models/IExcelProvider.types';
import { epiColumnsConstant } from './epiColumns.constant';

import { EpiSheetEnum } from './epiSheet.enum';

export interface IEpiSheet {
  name: string;
  id: EpiSheetEnum;
  columns: ITableSchema[];
}

export const epiSheetConstant = {
  [EpiSheetEnum.EPI]: {
    name: 'EPI',
    id: EpiSheetEnum.EPI,
    columns: epiColumnsConstant,
  },
} as Record<EpiSheetEnum, IEpiSheet>;
