import { StatusEnum } from '@prisma/client';
import { ITableSchema } from 'src/shared/providers/ExcelProvider/models/IExcelProvider.types';
import {
  statusEnumTranslate,
  StatusEnumTranslated,
} from 'src/shared/utils/translate/statusEnum.translate';
import { checkIsNumber } from 'src/shared/utils/validators/checkIdNumber';
import { checkIsEnum } from 'src/shared/utils/validators/checkIsEnum';
import { checkIsString } from 'src/shared/utils/validators/checkIsString';
import { checkIsValidCnpj } from 'src/shared/utils/validators/checkIsValidCnpj';

export const companyUniqueColumnsConstant = [
  {
    databaseName: 'id',
    isId: true,
    excelName: 'ID',
    required: false,
    checkHandler: checkIsString,
  },
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
    databaseName: 'employees.id',
    isId: true,
    excelName: 'ID (Empregado)',
    isArray: true,
    required: false,
    checkHandler: checkIsNumber,
  },
  {
    databaseName: 'employees.name',
    excelName: 'Nome do empregado',
    isArray: true,
    required: true,
    checkHandler: checkIsString,
  },
  {
    databaseName: 'employees.cpf',
    excelName: 'Nome do empregado',
    isArray: true,
    required: false,
    checkHandler: checkIsString,
  },
  {
    databaseName: 'employees.hierarchy.directory',
    excelName: 'Diretória',
    isArray: true,
    required: false,
    checkHandler: checkIsString,
  },
  {
    databaseName: 'employees.hierarchy.sector',
    excelName: 'Setor',
    isArray: true,
    required: false,
    checkHandler: checkIsString,
  },
  {
    databaseName: 'employees.hierarchy.workplaceId',
    excelName: 'Área de trabalho (ID)',
    isArray: true,
    required: true,
    checkHandler: checkIsNumber,
  },
  {
    databaseName: 'employees.status',
    excelName: 'Status',
    isEnum: [StatusEnumTranslated.ACTIVE, StatusEnumTranslated.INACTIVE],
    isArray: true,
    required: false,
    checkHandler: (value: any) =>
      checkIsEnum(statusEnumTranslate(value), StatusEnum),
  },
] as ITableSchema[];
