import { checkIsValidCpf } from './../../../../utils/validators/checkIsValidCpf';
import { StatusEnum } from '@prisma/client';
import { checkIsValidDate } from '../../../../../shared/utils/validators/checkIsValidDate';

import { excelWorkspaceNotes } from '../../../../../modules/files/utils/notes/excel-workspace-notes';
import { ITableSchema } from '../../../../providers/ExcelProvider/models/IExcelProvider.types';
import {
  statusEnumTranslateBrToUs,
  StatusEnumTranslated,
} from '../../../../utils/translate/statusEnum.translate';
import { checkIsEnum } from '../../../../utils/validators/checkIsEnum';
import { checkIsString } from '../../../../utils/validators/checkIsString';

export const employeesColumnsConstant = [
  {
    databaseName: 'cpf',
    excelName: 'CPF do empregado',
    isArray: false,
    required: true,
    checkHandler: checkIsValidCpf,
  },
  {
    databaseName: 'name',
    excelName: 'Nome do empregado',
    isArray: false,
    required: true,
    checkHandler: checkIsString,
  },
  {
    databaseName: 'birthdate',
    excelName: 'Nascimento',
    isArray: false,
    required: false,
    checkHandler: checkIsValidDate,
  },
  {
    databaseName: 'admissionDate',
    excelName: 'Admissão',
    isArray: false,
    required: false,
    checkHandler: checkIsValidDate,
  },
  {
    databaseName: 'abbreviation',
    excelName: 'Estabelecimento (Área de trabalho)',
    isArray: true,
    required: true,
    notes: excelWorkspaceNotes,
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
    required: true,
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
    databaseName: 'description',
    excelName: 'Descrição do cargo',
    isArray: false,
    required: false,
    checkHandler: checkIsString,
  },
  {
    databaseName: 'realDescription',
    excelName: 'Descrição real do cargo (entrevista com trabalhador)',
    isArray: false,
    required: false,
    checkHandler: checkIsString,
  },
  {
    databaseName: 'ghoName',
    excelName: 'GSE',
    isArray: false,
    required: false,
    notes: [
      'somente conecta um GSE ao cargo, para remover-lo deve-se usar o sistema',
    ],
    checkHandler: checkIsString,
  },
  {
    databaseName: 'ghoDescription',
    excelName: 'Descrição do GSE',
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
