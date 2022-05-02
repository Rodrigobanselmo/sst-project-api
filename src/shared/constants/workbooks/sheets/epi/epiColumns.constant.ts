import { checkIsValidDate } from 'src/shared/utils/validators/checkIsValidDate';
import { checkIsNational } from 'src/shared/utils/validators/epiTable/checkIsNational';
import { checkNormalize } from 'src/shared/utils/validators/epiTable/checkNormalize';
import { checkSituation } from 'src/shared/utils/validators/epiTable/checkSituation';

import { ITableSchema } from '../../../../providers/ExcelProvider/models/IExcelProvider.types';
import { checkIsString } from '../../../../utils/validators/checkIsString';

export const epiColumnsConstant = [
  {
    isId: true,
    databaseName: 'ca',
    excelName: 'CA',
    required: true,
    checkHandler: checkIsString,
  },
  {
    databaseName: 'expiredDate',
    excelName: 'Validade',
    required: true,
    checkHandler: checkIsValidDate,
  },
  {
    databaseName: 'isValid',
    excelName: 'Situação',
    required: true,
    checkHandler: checkSituation,
  },
  {
    databaseName: 'national',
    excelName: 'Natureza',
    required: true,
    checkHandler: checkIsNational,
  },
  {
    databaseName: 'equipment',
    excelName: 'NomeEquipamento',
    required: true,
    checkHandler: checkNormalize,
  },
  {
    databaseName: 'description',
    excelName: 'DescricaoEquipamento',
    checkHandler: checkNormalize,
  },
  {
    databaseName: 'report',
    excelName: 'AprovadoParaLaudo',
    checkHandler: checkNormalize,
  },
  {
    databaseName: 'restriction',
    excelName: 'RestricaoLaudo',
    checkHandler: checkNormalize,
  },
  {
    databaseName: 'observation',
    excelName: 'ObservacaoAnaliseLaudo',
    checkHandler: checkNormalize,
  },
] as ITableSchema[];
