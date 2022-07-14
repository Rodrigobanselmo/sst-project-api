import { checkIsNumber } from './../../../../utils/validators/checkIdNumber';
import { checkIsValidCnae } from '../../../../utils/validators/checkIsValidCnae';

import { ITableSchema } from '../../../../providers/ExcelProvider/models/IExcelProvider.types';
import { checkIsString } from '../../../../utils/validators/checkIsString';

export const cnaeColumnsConstant = [
  {
    isId: true,
    databaseName: 'code',
    excelName: 'Código',
    required: true,
    checkHandler: checkIsValidCnae,
  },
  {
    databaseName: 'name',
    excelName: 'Descrição',
    required: true,
    checkHandler: checkIsString,
  },
  {
    databaseName: 'riskDegree',
    excelName: 'Grau de Risco',
    required: true,
    checkHandler: checkIsNumber,
  },
] as ITableSchema[];
