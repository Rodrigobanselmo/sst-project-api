import { StatusEnum } from '@prisma/client';

import { excelWorkspaceNotes } from '../../../../../modules/files/utils/notes/excel-workspace-notes';
import { ITableSchema } from '../../../../providers/ExcelProvider/models/IExcelProvider.types';
import {
  statusEnumTranslateBrToUs,
  StatusEnumTranslated,
} from '../../../../utils/translate/statusEnum.translate';
import { checkIsEnum } from '../../../../utils/validators/checkIsEnum';
import { checkIsString } from '../../../../utils/validators/checkIsString';

export interface IHierarchiesColumns {
  directory: string;
  management: string;
  office: string;
  sub_office: string;
  sub_sector: string;
  realDescription: string;
  ghoDescription: string;
  description: string;
  status: string;
  sector: string;
  workspaceIds: string[];
  abbreviation?: string;
  ghoName?: string;
}

export const hierarchiesColumnsConstant = [
  {
    databaseName: 'abbreviation',
    excelName: 'Estabelecimento (Área de trabalho)',
    isArray: true,
    required: true,
    notes: excelWorkspaceNotes,
    checkHandler: checkIsString,
  },
  {
    databaseName: 'ghoName',
    excelName: 'GSE',
    isArray: false,
    required: false,
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
