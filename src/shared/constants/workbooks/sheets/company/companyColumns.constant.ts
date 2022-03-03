import { ITableSchema } from 'src/shared/providers/ExcelProvider/models/IExcelProvider.types';
import { checkIsNumber } from 'src/shared/utils/validators/checkIdNumber';
import { checkIsString } from 'src/shared/utils/validators/checkIsString';
import { checkIsValidCep } from 'src/shared/utils/validators/checkIsValidCep';
import { checkIsValidCnpj } from 'src/shared/utils/validators/checkIsValidCnpj';

export const companyColumnsConstant = [
  {
    databaseName: 'cnpj',
    excelName: 'CNPJ',
    required: true,
    checkHandler: checkIsValidCnpj,
  },
  {
    databaseName: 'name',
    excelName: 'Nome',
    required: true,
    checkHandler: checkIsString,
  },
  {
    databaseName: 'fantasy',
    excelName: 'Nome fantasia',
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
    isArray: true,
    databaseName: 'primary_activity.code',
    excelName: 'Código das atividades primárias',
    required: false,
    checkHandler: checkIsString,
  },
  {
    isArray: true,
    databaseName: 'secondary_activity.code',
    excelName: 'Código das atividades secundárias',
    required: false,
    checkHandler: checkIsString,
  },
  {
    databaseName: 'workspace.id',
    isId: true,
    excelName: 'ID (Área de trabalho)',
    isArray: true,
    required: false,
    checkHandler: checkIsNumber,
  },
  {
    databaseName: 'workspace.name',
    excelName: 'Nome da área de trabalho',
    isArray: true,
    required: true,
    checkHandler: checkIsString,
  },
  {
    databaseName: 'workspace.address.cep',
    excelName: 'CEP',
    isArray: true,
    required: true,
    checkHandler: checkIsValidCep,
  },
] as ITableSchema[];
