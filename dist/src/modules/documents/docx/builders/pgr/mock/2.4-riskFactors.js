"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.riskFactors3Section = void 0;
const styles_1 = require("../../../base/config/styles");
const variables_enum_1 = require("../enums/variables.enum");
const elements_types_1 = require("../types/elements.types");
const section_types_1 = require("../types/section.types");
exports.riskFactors3Section = {
    footer: true,
    header: true,
    data: [
        {
            properties: styles_1.sectionLandscapeProperties,
            type: section_types_1.PGRSectionTypeEnum.SECTION,
            footerText: `??${variables_enum_1.VariablesPGREnum.CHAPTER_2}??`,
            children: [
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH_TABLE,
                    text: 'Caracterização dos Fatores de Risco e Perigos',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.RISK_TABLE,
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.LEGEND,
                    text: '**CAS**: Chemical Abstract Service | | **PV**: Pressão de Vapor | **BEI**: Índices Biológicos de Exposição | **Carc**: Carcinogenicidade | **PE**: Ponto de Ebulição | **GES**: Grau de Efeito à Saúde (Severidade) | **NE**: Não Estabelecido | **ND**: Não Determinado',
                },
            ],
        },
    ],
};
//# sourceMappingURL=2.4-riskFactors.js.map