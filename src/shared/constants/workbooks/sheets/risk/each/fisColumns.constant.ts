import { ITableSchema } from '../../../../../../shared/providers/ExcelProvider/models/IExcelProvider.types';
import { checkIsString } from '../../../../../../shared/utils/validators/checkIsString';

export const phyColumnsConstant: ITableSchema[] = [
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
    databaseName: 'unit',
    excelName: 'Unidade',
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
