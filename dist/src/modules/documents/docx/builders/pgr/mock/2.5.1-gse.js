"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gse2Section = void 0;
const styles_1 = require("../../../base/config/styles");
const variables_enum_1 = require("../enums/variables.enum");
const elements_types_1 = require("../types/elements.types");
const section_types_1 = require("../types/section.types");
exports.gse2Section = {
    footer: true,
    header: true,
    data: [
        {
            properties: styles_1.sectionLandscapeProperties,
            type: section_types_1.PGRSectionTypeEnum.SECTION,
            footerText: `??${variables_enum_1.VariablesPGREnum.CHAPTER_2}??`,
            removeWithSomeEmptyVars: [variables_enum_1.VariablesPGREnum.COMPANY_HAS_GSE_RISK],
            children: [
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH_TABLE,
                    text: "Definição dos Grupos Similares de Exposição (GSE's)",
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.TABLE_GSE,
                },
            ],
        },
    ],
};
//# sourceMappingURL=2.5.1-gse.js.map