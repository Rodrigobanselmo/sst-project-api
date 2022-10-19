import { ITableSchema } from '../../../../providers/ExcelProvider/models/IExcelProvider.types';
import { checkIsString } from '../../../../utils/validators/checkIsString';
import { checkIsValidCid } from '../../../../utils/validators/checkIsValidCid';

export const cidColumnsConstant = [
  {
    isId: true,
    databaseName: 'cid',
    excelName: 'CID-10',
    required: true,
    checkHandler: checkIsValidCid,
  },
  {
    databaseName: 'description',
    excelName: 'Descrição',
    required: true,
    checkHandler: checkIsString,
  },
] as ITableSchema[];
