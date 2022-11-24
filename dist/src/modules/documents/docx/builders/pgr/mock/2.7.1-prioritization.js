"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prioritization2Section = void 0;
const styles_1 = require("../../../base/config/styles");
const variables_enum_1 = require("../enums/variables.enum");
const elements_types_1 = require("../types/elements.types");
const section_types_1 = require("../types/section.types");
exports.prioritization2Section = {
    footer: true,
    header: true,
    data: [
        {
            properties: styles_1.sectionLandscapeProperties,
            type: section_types_1.PGRSectionTypeEnum.SECTION,
            footerText: `??${variables_enum_1.VariablesPGREnum.CHAPTER_3}??`,
            removeWithAllEmptyVars: [variables_enum_1.VariablesPGREnum.COMPANY_HAS_GSE_RISK],
            children: [
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH_TABLE,
                    text: 'Resumo Avaliação Qualitativa/Quantitativa por GSE – Risco Ocupacional',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.TABLE_PRIORITIZATION,
                },
            ],
        },
        {
            properties: styles_1.sectionLandscapeProperties,
            type: section_types_1.PGRSectionTypeEnum.SECTION,
            footerText: `??${variables_enum_1.VariablesPGREnum.CHAPTER_3}??`,
            removeWithAllEmptyVars: [variables_enum_1.VariablesPGREnum.COMPANY_HAS_ENVIRONMENT_RISK],
            children: [
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH_TABLE,
                    text: 'Resumo Avaliação Qualitativa/Quantitativa por Ambiente de Trabalho – Risco Ocupacional',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.TABLE_PRIORITIZATION_ENV,
                },
            ],
        },
        {
            properties: styles_1.sectionLandscapeProperties,
            type: section_types_1.PGRSectionTypeEnum.SECTION,
            footerText: `??${variables_enum_1.VariablesPGREnum.CHAPTER_3}??`,
            removeWithAllEmptyVars: [variables_enum_1.VariablesPGREnum.COMPANY_HAS_CHARACTERIZATION_RISK],
            children: [
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH_TABLE,
                    text: 'Resumo Avaliação Qualitativa/Quantitativa pela Caracterização da Mão de Obra – Risco Ocupacional',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.TABLE_PRIORITIZATION_CHAR,
                },
            ],
        },
        {
            properties: styles_1.sectionLandscapeProperties,
            type: section_types_1.PGRSectionTypeEnum.SECTION,
            footerText: `??${variables_enum_1.VariablesPGREnum.CHAPTER_3}??`,
            removeWithAllEmptyVars: [variables_enum_1.VariablesPGREnum.COMPANY_HAS_HIERARCHY_RISK],
            children: [
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH_TABLE,
                    text: 'Resumo Avaliação Qualitativa/Quantitativa por Fatores de Riscos/Perigos Atrelados diretamente a um nível hierarquico do organograma da empresa – Risco Ocupacional',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.TABLE_PRIORITIZATION_HIERARCHY,
                },
            ],
        },
    ],
};
//# sourceMappingURL=2.7.1-prioritization.js.map