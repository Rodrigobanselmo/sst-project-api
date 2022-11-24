"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.employeeSection = void 0;
const styles_1 = require("../../../base/config/styles");
const variables_enum_1 = require("../enums/variables.enum");
const elements_types_1 = require("../types/elements.types");
const section_types_1 = require("../types/section.types");
exports.employeeSection = {
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
                    text: 'CARACTERIZAÇÃO DA MÃO DE OBRA ((NR-01 ITEM 1.5.7.3.2 ALÍNEA B)',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.H2,
                    text: 'Macroestrutura',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.H3,
                    text: 'Caracterização Organizacional',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: 'De acordo com o Organograma – Macroestrutura, a empresa encontra-se organizada através de Setores. Na tabela a seguir são apresentados os setores como as respectivas quantidades de trabalhadores.',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH_TABLE,
                    text: 'Estrutura de Setores com as quantidades respectivas de trabalhadores',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.HIERARCHY_ORG_TABLE,
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: `Total de trabalhadores: **??${variables_enum_1.VariablesPGREnum.COMPANY_EMPLOYEES_TOTAL}??**`,
                    spacing: { before: 200 },
                },
            ],
        },
    ],
};
//# sourceMappingURL=2.1-employee.js.map