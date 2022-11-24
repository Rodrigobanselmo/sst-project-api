"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.riskFactorsSection = void 0;
const styles_1 = require("../../../base/config/styles");
const variables_enum_1 = require("../enums/variables.enum");
const elements_types_1 = require("../types/elements.types");
const section_types_1 = require("../types/section.types");
exports.riskFactorsSection = {
    footer: true,
    header: true,
    data: [
        {
            properties: styles_1.sectionLandscapeProperties,
            type: section_types_1.PGRSectionTypeEnum.SECTION,
            footerText: `??${variables_enum_1.VariablesPGREnum.CHAPTER_2}??`,
            children: [
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.H1,
                    text: 'CARACTERIZAÇÃO DOS FATORES DE RISCO OCUPACIONAL (NR-01 ITEM 1.5.4.3.1 ALÍNEA B)',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.H2,
                    text: 'Relação dos Fatores de Risco e Perigos',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.H3,
                    text: 'Caracterização Organizacional',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: `Na Tabela a seguir é apresentada toda estrutura organizacional da ??${variables_enum_1.VariablesPGREnum.COMPANY_SHORT_NAME}?? onde encontra-se assinalado com um X os fatores de risco presentes em cada departamento da empresa.`,
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.HIERARCHY_RISK_TABLE,
                },
            ],
        },
    ],
};
//# sourceMappingURL=2.2-riskFactors.js.map