import { StatusEnum } from '@prisma/client';

import { excelWorkplaceNotes } from '../../../../../modules/files/utils/notes/excel-workplace-notes';
import { ITableSchema } from '../../../../providers/ExcelProvider/models/IExcelProvider.types';
import {
  statusEnumTranslateBrToUs,
  StatusEnumTranslated,
} from '../../../../utils/translate/statusEnum.translate';
import { checkIsEnum } from '../../../../utils/validators/checkIsEnum';
import { checkIsString } from '../../../../utils/validators/checkIsString';

export const employeesColumnsConstant = [
  {
    databaseName: 'name',
    excelName: 'Nome do empregado',
    isArray: false,
    required: true,
    checkHandler: checkIsString,
  },
  {
    databaseName: 'cpf',
    excelName: 'CPF do empregado',
    isArray: false,
    required: false,
    checkHandler: checkIsString,
  },
  {
    databaseName: 'abbreviation',
    excelName: 'Estabelecimento (Área de trabalho)',
    isArray: false,
    required: true,
    notes: excelWorkplaceNotes,
    checkHandler: checkIsString,
  },
  {
    databaseName: 'directory',
    excelName: 'Diretória',
    isArray: false,
    required: false,
    checkHandler: checkIsString,
  },
  {
    databaseName: 'management',
    excelName: 'Gereência',
    isArray: false,
    required: false,
    checkHandler: checkIsString,
  },
  {
    databaseName: 'sector',
    excelName: 'Setor',
    isArray: false,
    required: false,
    checkHandler: checkIsString,
  },
  {
    databaseName: 'sub_sector',
    excelName: 'Sub Setor',
    isArray: false,
    required: false,
    checkHandler: checkIsString,
  },
  {
    databaseName: 'office',
    excelName: 'Cargo',
    isArray: false,
    required: true,
    checkHandler: checkIsString,
  },
  {
    databaseName: 'sub_office',
    excelName: 'Cargo desenvolvido',
    isArray: false,
    required: false,
    checkHandler: checkIsString,
  },
  {
    databaseName: 'status',
    excelName: 'Status',
    isEnum: [StatusEnumTranslated.ACTIVE, StatusEnumTranslated.INACTIVE],
    isArray: false,
    notes: [StatusEnumTranslated.ACTIVE, StatusEnumTranslated.INACTIVE],
    required: false,
    checkHandler: (value: any) =>
      checkIsEnum(statusEnumTranslateBrToUs(value), StatusEnum),
  },
] as ITableSchema[];
