"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mvvSection = void 0;
const variables_enum_1 = require("../enums/variables.enum");
const elements_types_1 = require("../types/elements.types");
const section_types_1 = require("../types/section.types");
exports.mvvSection = {
    footer: true,
    header: true,
    data: [
        {
            type: section_types_1.PGRSectionTypeEnum.SECTION,
            footerText: `??${variables_enum_1.VariablesPGREnum.CHAPTER_1}??`,
            removeWithSomeEmptyVars: [variables_enum_1.VariablesPGREnum.COMPANY_MISSION, variables_enum_1.VariablesPGREnum.COMPANY_VISION, variables_enum_1.VariablesPGREnum.COMPANY_VALUES],
            children: [
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.H1,
                    text: 'POLÍTICA DE SAÚDE E SEGURANÇA OCUPACIONAL',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: `**Segue a Política de Qualidade da ??${variables_enum_1.VariablesPGREnum.COMPANY_SHORT_NAME}??**`,
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: '**MISSÃO**',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: `??${variables_enum_1.VariablesPGREnum.COMPANY_MISSION}??`,
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: '**VISÃO**',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: `??${variables_enum_1.VariablesPGREnum.COMPANY_VISION}??`,
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: '**VALORES**',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: `??${variables_enum_1.VariablesPGREnum.COMPANY_VALUES}??`,
                },
            ],
        },
    ],
};
//# sourceMappingURL=1.4-mvv.js.map