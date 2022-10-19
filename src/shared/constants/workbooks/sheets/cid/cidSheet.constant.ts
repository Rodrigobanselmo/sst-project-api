import { ITableSchema } from '../../../../providers/ExcelProvider/models/IExcelProvider.types';
import { cidColumnsConstant } from './cidColumns.constant';

import { CidSheetEnum } from './cidSheet.enum';

export interface ICidSheet {
  name: string;
  id: CidSheetEnum;
  columns: ITableSchema[];
}

export const cidSheetConstant = {
  [CidSheetEnum.CID]: {
    name: 'CID',
    id: CidSheetEnum.CID,
    columns: cidColumnsConstant,
  },
} as Record<CidSheetEnum, ICidSheet>;
