import { checkIsTrue } from './../../../../utils/validators/checkIsTrue';
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
  {
    databaseName: 'class',
    excelName: 'Classificação',
    required: true,
    checkHandler: checkIsString,
  },
  {
    databaseName: 'sex',
    excelName: 'Restrição por sexo',
    required: true,
    checkHandler: checkIsString,
  },
  {
    databaseName: 'kill',
    excelName: 'Causa Obito',
    required: true,
    checkHandler: checkIsTrue,
  },
] as ITableSchema[];
