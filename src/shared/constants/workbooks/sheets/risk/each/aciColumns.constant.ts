import { ITableSchema } from '../../../../../providers/ExcelProvider/models/IExcelProvider.types';
import { checkIsString } from '../../../../../utils/validators/checkIsString';
import { checkIsBoolean } from '../../../../../utils/validators/checkIsBoolean';

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
    checkHandler: checkIsBoolean,
    notes: () => ['Marcar com "X" para VERDADEIRO e vazio para falso'],
  },
];
