import { sectionLandscapeProperties } from '../../../base/config/styles';
import { VariablesPGREnum } from '../enums/variables.enum';
import { PGRSectionChildrenTypeEnum } from '../types/elements.types';
import {
  IDocumentPGRSectionGroup,
  PGRSectionTypeEnum,
} from '../types/section.types';

export const gse2Section: IDocumentPGRSectionGroup = {
  footer: true,
  header: true,
  data: [
    {
      properties: sectionLandscapeProperties,
      type: PGRSectionTypeEnum.SECTION,
      footerText: `??${VariablesPGREnum.CHAPTER_2}??`,
      removeWithSomeEmptyVars: [VariablesPGREnum.COMPANY_HAS_GSE_RISK],
      children: [
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH_TABLE,
          text: "Definição dos Grupos Similares de Exposição (GSE's)",
        },
        {
          type: PGRSectionChildrenTypeEnum.TABLE_GSE,
        },
      ],
    },
    {
      properties: sectionLandscapeProperties,
      type: PGRSectionTypeEnum.SECTION,
      footerText: `??${VariablesPGREnum.CHAPTER_2}??`,
      removeWithAllEmptyVars: [
        VariablesPGREnum.COMPANY_HAS_ENVIRONMENT_ADM,
        VariablesPGREnum.COMPANY_HAS_ENVIRONMENT_GENERAL,
        VariablesPGREnum.COMPANY_HAS_ENVIRONMENT_OP,
        VariablesPGREnum.COMPANY_HAS_ENVIRONMENT_SUP,
      ],
      children: [
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH_TABLE,
          text: 'Relação de cargos por Ambientes de Trabalho',
        },
        {
          type: PGRSectionChildrenTypeEnum.TABLE_HIERARCHY_ENV,
        },
      ],
    },
    {
      properties: sectionLandscapeProperties,
      type: PGRSectionTypeEnum.SECTION,
      footerText: `??${VariablesPGREnum.CHAPTER_2}??`,
      removeWithAllEmptyVars: [
        VariablesPGREnum.COMPANY_HAS_CHARACTERIZATION_ACT,
        VariablesPGREnum.COMPANY_HAS_CHARACTERIZATION_WORK,
        VariablesPGREnum.COMPANY_HAS_CHARACTERIZATION_EQUIP,
      ],
      children: [
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH_TABLE,
          text: 'Relação de Cargos por Posto de trabalho, Atividades e Equipementos provenientes da caracterização da mão de obra',
        },
        {
          type: PGRSectionChildrenTypeEnum.TABLE_HIERARCHY_CHAR,
        },
      ],
    },
  ],
};
