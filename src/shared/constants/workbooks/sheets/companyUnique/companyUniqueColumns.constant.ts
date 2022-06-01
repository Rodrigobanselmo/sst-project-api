import { StatusEnum } from '@prisma/client';
import { excelWorkspaceNotes } from '../../../../../modules/files/utils/notes/excel-workspace-notes';
import { ITableSchema } from '../../../../../shared/providers/ExcelProvider/models/IExcelProvider.types';
import {
  statusEnumTranslateBrToUs,
  StatusEnumTranslated,
} from '../../../../../shared/utils/translate/statusEnum.translate';
import { checkIsNumber } from '../../../../../shared/utils/validators/checkIdNumber';
import { checkIsEnum } from '../../../../../shared/utils/validators/checkIsEnum';
import { checkIsString } from '../../../../../shared/utils/validators/checkIsString';
import { checkIsValidCnpj } from '../../../../../shared/utils/validators/checkIsValidCnpj';

export const companyUniqueColumnsConstant = [
  {
    databaseName: 'id',
    isId: true,
    excelName: 'ID',
    required: true,
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
    excelName: 'CPF do empregado',
    isArray: true,
    required: false,
    checkHandler: checkIsString,
  },
  {
    databaseName: 'employees.workspaceId',
    excelName: 'Área de trabalho (ID)',
    isArray: true,
    required: true,
    notes: excelWorkspaceNotes,
    checkHandler: checkIsNumber,
  },
  {
    databaseName: 'employees.directory',
    excelName: 'Diretória',
    isArray: true,
    required: false,
    checkHandler: checkIsString,
  },
  {
    databaseName: 'employees.management',
    excelName: 'Gereência',
    isArray: true,
    required: false,
    checkHandler: checkIsString,
  },
  {
    databaseName: 'employees.sector',
    excelName: 'Setor',
    isArray: true,
    required: false,
    checkHandler: checkIsString,
  },
  {
    databaseName: 'employees.sub_sector',
    excelName: 'Sub Setor',
    isArray: true,
    required: false,
    checkHandler: checkIsString,
  },
  {
    databaseName: 'employees.office',
    excelName: 'Cargo',
    isArray: true,
    required: true,
    checkHandler: checkIsString,
  },
  {
    databaseName: 'employees.sub_office',
    excelName: 'Cargo desenvolvido',
    isArray: true,
    required: false,
    checkHandler: checkIsString,
  },
  {
    databaseName: 'employees.status',
    excelName: 'Status',
    isEnum: [StatusEnumTranslated.ACTIVE, StatusEnumTranslated.INACTIVE],
    isArray: true,
    notes: [StatusEnumTranslated.ACTIVE, StatusEnumTranslated.INACTIVE],
    required: false,
    checkHandler: (value: any) =>
      checkIsEnum(statusEnumTranslateBrToUs(value), StatusEnum),
  },
] as ITableSchema[];
