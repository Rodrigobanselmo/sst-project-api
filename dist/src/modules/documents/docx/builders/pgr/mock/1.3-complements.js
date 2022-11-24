"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.complementsSection = void 0;
const variables_enum_1 = require("../enums/variables.enum");
const elements_types_1 = require("../types/elements.types");
const section_types_1 = require("../types/section.types");
exports.complementsSection = {
    footer: true,
    header: true,
    data: [
        {
            type: section_types_1.PGRSectionTypeEnum.SECTION,
            footerText: `??${variables_enum_1.VariablesPGREnum.CHAPTER_1}??`,
            children: [
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.H1,
                    text: 'DOCUMENTOS COMPLEMENTARES',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.COMPLEMENTARY_DOCS,
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.H2,
                    text: 'Sistemas de Gestão de SST, HO, MA e Qualidades existentes:',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: 'O PGR pode ser atendido por sistemas de gestão, desde que estes cumpram as exigências previstas nesta NR e em dispositivos legais de segurança e saúde no trabalho. **(NR-01 Item 1.5.3.1.2)**.',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.COMPLEMENTARY_SYSTEMS,
                },
            ],
        },
    ],
};
//# sourceMappingURL=1.3-complements.js.map