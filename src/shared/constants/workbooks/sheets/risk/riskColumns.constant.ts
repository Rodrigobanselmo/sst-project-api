import { checkIsTrue } from './../../../../utils/validators/checkIsTrue';
import { ITableSchema } from '../../../../../shared/providers/ExcelProvider/models/IExcelProvider.types';
import { checkIsNumber } from '../../../../../shared/utils/validators/checkIdNumber';
import { checkIsString } from '../../../../../shared/utils/validators/checkIsString';

export const riskColumnsConstant = [
  {
    databaseName: 'name',
    excelName: 'Descrição',
    required: true,
    checkHandler: checkIsString,
  },
  {
    databaseName: 'id',
    isId: true,
    excelName: 'ID',
    required: false,
    checkHandler: checkIsString,
  },
  {
    databaseName: 'severity',
    excelName: 'Severidade',
    required: false,
    checkHandler: checkIsNumber,
  },
  {
    databaseName: 'risk',
    excelName:
      'Risco (Órgãos Alvo ou Maior Parte do Corpo Prejudicada -Resumo de Sintomas)',
    required: false,
    checkHandler: checkIsString,
  },
  {
    databaseName: 'symptoms',
    excelName: 'Sintomas, Danos ou Qualquer  consequência negativa',
    required: false,
    checkHandler: checkIsString,
  },
  {
    isArray: true,
    databaseName: 'propagation',
    excelName: 'Meio de propagação',
    required: false,
    checkHandler: checkIsString,
  },
  {
    isArray: false,
    databaseName: 'isPGR',
    excelName: 'PGR',
    required: false,
    checkHandler: checkIsTrue,
    notes: () => ['VERDADEIRO', 'FALSO'],
  },
  {
    isArray: false,
    databaseName: 'isPCMSO',
    excelName: 'PCMSO',
    required: false,
    checkHandler: checkIsTrue,
    notes: () => ['VERDADEIRO', 'FALSO'],
  },
  {
    isArray: false,
    databaseName: 'isAso',
    excelName: 'ASO',
    required: false,
    checkHandler: checkIsTrue,
    notes: () => ['VERDADEIRO', 'FALSO'],
  },
  {
    isArray: false,
    databaseName: 'isPPP',
    excelName: 'PPP',
    required: false,
    checkHandler: checkIsTrue,
    notes: () => ['VERDADEIRO', 'FALSO'],
  },
  // {
  //   isId: true,
  //   isArray: true,
  //   databaseName: 'recMed.id',
  //   excelName: 'ID (recom. / medida d.e cont.)',
  //   required: false,
  //   checkHandler: checkIsNumber,
  // },
  // {
  //   databaseName: 'recMed.recName',
  //   excelName: 'Recomendações',
  //   isArray: true,
  //   required: false,
  //   checkHandler: checkIsString,
  // },
  // {
  //   databaseName: 'recMed.medName',
  //   isArray: true,
  //   excelName: 'Medidas de controle',
  //   required: false,
  //   checkHandler: checkIsString,
  // },
  // {
  //   isId: true,
  //   isArray: true,
  //   databaseName: 'generateSource.id',
  //   excelName: 'ID (fonte geradora)',
  //   required: false,
  //   checkHandler: checkIsNumber,
  // },
  // {
  //   databaseName: 'generateSource.name',
  //   excelName: 'Fonte geradora',
  //   isArray: true,
  //   required: false,
  //   checkHandler: checkIsString,
  // },
] as ITableSchema[];
