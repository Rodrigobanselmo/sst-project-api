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
    checkHandler: checkIsNumber,
  },
  {
    databaseName: 'appendix',
    excelName: 'Anexo',
    required: false,
    checkHandler: checkIsString,
  },
  {
    databaseName: 'severity',
    excelName: 'Severidade',
    required: true,
    checkHandler: checkIsNumber,
  },
  {
    isArray: true,
    databaseName: 'propagation',
    excelName: 'Meio de propagação',
    required: false,
    checkHandler: checkIsString,
  },
  {
    isId: true,
    isArray: true,
    databaseName: 'recMed.id',
    excelName: 'ID (recom. / medida d.e cont.)',
    required: false,
    checkHandler: checkIsNumber,
  },
  {
    databaseName: 'recMed.recName',
    excelName: 'Recomendações',
    isArray: true,
    required: false,
    checkHandler: checkIsString,
  },
  {
    databaseName: 'recMed.medName',
    isArray: true,
    excelName: 'Medidas de controle',
    required: false,
    checkHandler: checkIsString,
  },
  {
    isId: true,
    isArray: true,
    databaseName: 'generateSource.id',
    excelName: 'ID (fonte geradora)',
    required: false,
    checkHandler: checkIsNumber,
  },
  {
    databaseName: 'generateSource.name',
    excelName: 'Fonte geradora',
    isArray: true,
    required: false,
    checkHandler: checkIsString,
  },
] as ITableSchema[];
