import { sectionLandscapeProperties } from '../../../base/config/styles';
import { VariablesPGREnum } from '../enums/variables.enum';
import { DocumentChildrenTypeEnum as DocumentSectionChildrenTypeEnum } from '@/@v2/documents/domain/enums/document-children-type.enum';
import { IDocumentPGRSectionGroup } from '../../../../../../domain/types/section.types';
import { DocumentSectionTypeEnum } from '@/@v2/documents/domain/enums/document-section-type.enum';

export const gse2Section: IDocumentPGRSectionGroup = {
  data: [
    {
      properties: sectionLandscapeProperties,
      type: DocumentSectionTypeEnum.SECTION,
      footerText: `??${VariablesPGREnum.CHAPTER_2}??`,
      removeWithSomeEmptyVars: [VariablesPGREnum.COMPANY_HAS_GSE_RISK],
      children: [
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH_TABLE,
          text: "Definição dos Grupos Similares de Exposição (GSE's)",
        },
        {
          type: DocumentSectionChildrenTypeEnum.TABLE_GSE,
        },
      ],
    },
    // {
    //   properties: sectionLandscapeProperties,
    //   type: PGRSectionTypeEnum.SECTION,
    //   footerText: `??${VariablesPGREnum.CHAPTER_2}??`,
    //   removeWithAllEmptyVars: [
    //     VariablesPGREnum.COMPANY_HAS_ENVIRONMENT_ADM,
    //     VariablesPGREnum.COMPANY_HAS_ENVIRONMENT_GENERAL,
    //     VariablesPGREnum.COMPANY_HAS_ENVIRONMENT_OP,
    //     VariablesPGREnum.COMPANY_HAS_ENVIRONMENT_SUP,
    //   ],
    //   children: [
    //     {
    //       type: PGRSectionChildrenTypeEnum.PARAGRAPH_TABLE,
    //       text: 'Relação de cargos por Ambientes de Trabalho',
    //     },
    //     {
    //       type: PGRSectionChildrenTypeEnum.TABLE_HIERARCHY_ENV,
    //     },
    //   ],
    // },
    // {
    //   properties: sectionLandscapeProperties,
    //   type: PGRSectionTypeEnum.SECTION,
    //   footerText: `??${VariablesPGREnum.CHAPTER_2}??`,
    //   removeWithAllEmptyVars: [
    //     VariablesPGREnum.COMPANY_HAS_CHARACTERIZATION_ACT,
    //     VariablesPGREnum.COMPANY_HAS_CHARACTERIZATION_WORK,
    //     VariablesPGREnum.COMPANY_HAS_CHARACTERIZATION_EQUIP,
    //   ],
    //   children: [
    //     {
    //       type: PGRSectionChildrenTypeEnum.PARAGRAPH_TABLE,
    //       text: 'Relação de Cargos por Posto de trabalho, Atividades e Equipementos provenientes da caracterização da mão de obra',
    //     },
    //     {
    //       type: PGRSectionChildrenTypeEnum.TABLE_HIERARCHY_CHAR,
    //     },
    //   ],
    // },
  ],
};
