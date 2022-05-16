import { ITableSchema } from '../../../../../providers/ExcelProvider/models/IExcelProvider.types';
import { checkIsString } from '../../../../../utils/validators/checkIsString';

export const bioColumnsConstant: ITableSchema[] = [
  {
    databaseName: 'method',
    excelName: 'Método Amostragem',
    required: false,
    checkHandler: checkIsString,
  },
  {
    databaseName: 'appendix',
    excelName: 'Anexo',
    required: false,
    checkHandler: checkIsString,
  },
];
