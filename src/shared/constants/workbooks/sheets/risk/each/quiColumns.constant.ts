import { ITableSchema } from '../../../../../providers/ExcelProvider/models/IExcelProvider.types';
import { checkIsString } from '../../../../../utils/validators/checkIsString';

export const quiColumnsConstant: ITableSchema[] = [
  {
    databaseName: 'cas',
    excelName: 'Nº CAS',
    required: false,
    checkHandler: checkIsString,
  },
  {
    databaseName: 'breather',
    excelName: 'Respirador/Filtro',
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
    databaseName: 'nr15lt',
    excelName: 'NR-15 LT (ppm)',
    required: false,
    checkHandler: checkIsString,
  },
  {
    databaseName: 'twa',
    excelName: 'ACGIH TWA',
    required: false,
    checkHandler: checkIsString,
  },
  {
    databaseName: 'stel',
    excelName: 'ACGIH STEL ',
    required: false,
    checkHandler: checkIsString,
  },
  {
    databaseName: 'ipvs',
    excelName: 'IPVS/IDHL',
    required: false,
    checkHandler: checkIsString,
  },
  {
    databaseName: 'pv',
    excelName: 'PV (mmHg)  ',
    required: false,
    checkHandler: checkIsString,
  },
  {
    databaseName: 'pe',
    excelName: 'PE (ºC)  ',
    required: false,
    checkHandler: checkIsString,
  },
  {
    databaseName: 'carnogenicityACGIH',
    excelName: `Carcinogenicidade ACGIH  `,
    required: false,
    checkHandler: checkIsString,
  },
  {
    databaseName: 'carnogenicityLinach',
    excelName: 'Carcinogenicidade LINACH ',
    required: false,
    checkHandler: checkIsString,
  },
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
    databaseName: 'appendix',
    excelName: 'Anexo',
    required: false,
    checkHandler: checkIsString,
  },
];
