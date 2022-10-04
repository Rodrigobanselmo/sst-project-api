import { checkIsTrue } from './../../../../../utils/validators/checkIsTrue';
import { ITableSchema } from '../../../../../providers/ExcelProvider/models/IExcelProvider.types';
import { checkIsString } from '../../../../../utils/validators/checkIsString';

export const aciColumnsConstant: ITableSchema[] = [
  {
    databaseName: 'exame',
    excelName: 'BEI/Exame Complementar (ACGIH/NR07) ou Critério Médico',
    required: false,
    checkHandler: checkIsString,
  },
  {
    databaseName: 'method',
    excelName: 'Método Amostragem',
    required: false,
    checkHandler: checkIsString,
  },
  {
    databaseName: 'isEmergency',
    excelName: 'Plano de Atendimento a Emergência',
    required: false,
    checkHandler: checkIsTrue,
    notes: () => ['VERDADEIRO', 'FALSO'],
  },
];
