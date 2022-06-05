import { ITableSchema } from '../../../../providers/ExcelProvider/models/IExcelProvider.types';
import { hierarchiesColumnsConstant } from './hierarchiesColumns.constant';

import { HierarchiesSheetEnum } from './hierarchies.enum';

export interface IEmployeeSheet {
  name: string;
  id: HierarchiesSheetEnum;
  columns: ITableSchema[];
}

export const hierarchiesSheetConstant = {
  [HierarchiesSheetEnum.HIERARCHIES]: {
    name: 'Empregados',
    id: HierarchiesSheetEnum.HIERARCHIES,
    columns: hierarchiesColumnsConstant,
  },
} as Record<HierarchiesSheetEnum, IEmployeeSheet>;
