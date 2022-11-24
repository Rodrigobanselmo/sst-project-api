"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachmentsSection = void 0;
const styles_1 = require("../../../base/config/styles");
const elements_types_1 = require("../types/elements.types");
const section_types_1 = require("../types/section.types");
exports.attachmentsSection = {
    footer: true,
    header: true,
    data: [
        {
            type: section_types_1.PGRSectionTypeEnum.CHAPTER,
            text: `ANEXOS`,
        },
        {
            type: section_types_1.PGRSectionTypeEnum.CHAPTER,
            text: `ANEXO 01 – Inventário de Risco por Função (APR)`,
        },
        {
            type: section_types_1.PGRSectionTypeEnum.APR,
        },
        {
            type: section_types_1.PGRSectionTypeEnum.CHAPTER,
            text: `ANEXO 02 – Plano de Ação Detalhado`,
        },
        {
            type: section_types_1.PGRSectionTypeEnum.SECTION,
            properties: styles_1.sectionLandscapeProperties,
            children: [
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PLAN_TABLE,
                },
            ],
        },
    ],
};
//# sourceMappingURL=3.0-anexos.js.map