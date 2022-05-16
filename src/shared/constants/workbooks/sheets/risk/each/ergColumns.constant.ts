import { ITableSchema } from '../../../../../providers/ExcelProvider/models/IExcelProvider.types';
import { checkIsString } from '../../../../../utils/validators/checkIsString';

export const ergColumnsConstant: ITableSchema[] = [
  {
    databaseName: 'unit',
    excelName: 'Unidade',
    required: false,
    checkHandler: checkIsString,
  },
  {
    databaseName: 'method',
    excelName: 'Método Amostragem',
    required: false,
    checkHandler: checkIsString,
  },
];
