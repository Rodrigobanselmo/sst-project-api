import { sectionLandscapeProperties } from '../../../base/config/styles';
import { VariablesPGREnum } from '../enums/variables.enum';
import { DocumentSectionChildrenTypeEnum } from '../types/elements.types';
import { IDocumentPGRSectionGroup, DocumentSectionTypeEnum } from '../types/section.types';

export const prioritization2Section: IDocumentPGRSectionGroup = {
  footer: true,
  header: true,
  data: [
    {
      properties: sectionLandscapeProperties,
      type: DocumentSectionTypeEnum.SECTION,
      footerText: `??${VariablesPGREnum.CHAPTER_3}??`,
      removeWithAllEmptyVars: [VariablesPGREnum.COMPANY_HAS_GSE_RISK],
      children: [
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH_TABLE,
          text: 'Resumo Avaliação Qualitativa/Quantitativa por GSE – Risco Ocupacional',
        },
        {
          type: DocumentSectionChildrenTypeEnum.TABLE_PRIORITIZATION,
        },
      ],
    },
    {
      properties: sectionLandscapeProperties,
      type: DocumentSectionTypeEnum.SECTION,
      footerText: `??${VariablesPGREnum.CHAPTER_3}??`,
      removeWithAllEmptyVars: [VariablesPGREnum.COMPANY_HAS_ENVIRONMENT_RISK],
      children: [
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH_TABLE,
          text: 'Resumo Avaliação Qualitativa/Quantitativa por Ambiente de Trabalho – Risco Ocupacional',
        },
        {
          type: DocumentSectionChildrenTypeEnum.TABLE_PRIORITIZATION_ENV,
        },
      ],
    },
    {
      properties: sectionLandscapeProperties,
      type: DocumentSectionTypeEnum.SECTION,
      footerText: `??${VariablesPGREnum.CHAPTER_3}??`,
      removeWithAllEmptyVars: [VariablesPGREnum.COMPANY_HAS_CHARACTERIZATION_RISK],
      children: [
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH_TABLE,
          text: 'Resumo Avaliação Qualitativa/Quantitativa pela Caracterização da Mão de Obra – Risco Ocupacional',
        },
        {
          type: DocumentSectionChildrenTypeEnum.TABLE_PRIORITIZATION_CHAR,
        },
      ],
    },
    {
      properties: sectionLandscapeProperties,
      type: DocumentSectionTypeEnum.SECTION,
      footerText: `??${VariablesPGREnum.CHAPTER_3}??`,
      removeWithAllEmptyVars: [VariablesPGREnum.COMPANY_HAS_HIERARCHY_RISK],
      children: [
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH_TABLE,
          text: 'Resumo Avaliação Qualitativa/Quantitativa por Fatores de Riscos/Perigos Atrelados diretamente a um nível hierarquico do organograma da empresa – Risco Ocupacional',
        },
        {
          type: DocumentSectionChildrenTypeEnum.TABLE_PRIORITIZATION_HIERARCHY,
        },
      ],
    },
  ],
};
