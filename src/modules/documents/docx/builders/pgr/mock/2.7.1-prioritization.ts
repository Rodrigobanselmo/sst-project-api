import { sectionLandscapeProperties } from '../../../base/config/styles';
import { VariablesPGREnum } from '../enums/variables.enum';
import { PGRSectionChildrenTypeEnum } from '../types/elements.types';
import {
  IDocumentPGRSectionGroup,
  PGRSectionTypeEnum,
} from '../types/section.types';

export const prioritization2Section: IDocumentPGRSectionGroup = {
  footer: true,
  header: true,
  data: [
    {
      properties: sectionLandscapeProperties,
      type: PGRSectionTypeEnum.SECTION,
      footerText: `??${VariablesPGREnum.CHAPTER_2}??`,
      children: [
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH_TABLE,
          text: 'Resumo Avaliação Qualitativa/Quantitativa por GSE – Risco Ocupacional',
          removeWithAllEmptyVars: [VariablesPGREnum.COMPANY_HAS_GSE_RISK],
        },
        {
          type: PGRSectionChildrenTypeEnum.TABLE_PRIORITIZATION,
          removeWithAllEmptyVars: [VariablesPGREnum.COMPANY_HAS_GSE_RISK],
        },
        {
          type: PGRSectionChildrenTypeEnum.BREAK,
          removeWithAllEmptyVars: [VariablesPGREnum.COMPANY_HAS_GSE_RISK],
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH_TABLE,
          text: 'Resumo Avaliação Qualitativa/Quantitativa por Ambiente de Trabalho – Risco Ocupacional',
          removeWithAllEmptyVars: [
            VariablesPGREnum.COMPANY_HAS_ENVIRONMENT_RISK,
          ],
        },
        {
          type: PGRSectionChildrenTypeEnum.TABLE_PRIORITIZATION_ENV,
          removeWithAllEmptyVars: [
            VariablesPGREnum.COMPANY_HAS_ENVIRONMENT_RISK,
          ],
        },
        {
          type: PGRSectionChildrenTypeEnum.BREAK,
          removeWithSomeEmptyVars: [
            VariablesPGREnum.COMPANY_HAS_ENVIRONMENT_RISK,
          ],
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH_TABLE,
          text: 'Resumo Avaliação Qualitativa/Quantitativa pela Caracterização da Mão de Obra – Risco Ocupacional',
          removeWithAllEmptyVars: [
            VariablesPGREnum.COMPANY_HAS_CHARACTERIZATION_RISK,
          ],
        },
        {
          type: PGRSectionChildrenTypeEnum.TABLE_PRIORITIZATION_CHAR,
          removeWithSomeEmptyVars: [
            VariablesPGREnum.COMPANY_HAS_CHARACTERIZATION_RISK,
          ],
        },
        {
          type: PGRSectionChildrenTypeEnum.BREAK,
          removeWithAllEmptyVars: [
            VariablesPGREnum.COMPANY_HAS_CHARACTERIZATION_RISK,
            VariablesPGREnum.COMPANY_HAS_HIERARCHY_RISK,
          ],
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH_TABLE,
          text: 'Resumo Avaliação Qualitativa/Quantitativa por Fatores de Riscos/Perigos Atrelados diretamente a um nível hierarquico do organograma da empresa – Risco Ocupacional',
          removeWithAllEmptyVars: [VariablesPGREnum.COMPANY_HAS_HIERARCHY_RISK],
        },
        {
          type: PGRSectionChildrenTypeEnum.TABLE_PRIORITIZATION_HIERARCHY,
          removeWithAllEmptyVars: [VariablesPGREnum.COMPANY_HAS_HIERARCHY_RISK],
        },
      ],
    },
  ],
};
