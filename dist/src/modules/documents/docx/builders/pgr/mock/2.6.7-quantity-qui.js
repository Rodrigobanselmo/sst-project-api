"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quantityQuiSection = void 0;
const variables_enum_1 = require("../enums/variables.enum");
const elements_types_1 = require("../types/elements.types");
const section_types_1 = require("../types/section.types");
exports.quantityQuiSection = {
    footer: true,
    header: true,
    data: [
        {
            type: section_types_1.PGRSectionTypeEnum.SECTION,
            footerText: `??${variables_enum_1.VariablesPGREnum.CHAPTER_3}??`,
            removeWithSomeEmptyVars: [variables_enum_1.VariablesPGREnum.HAS_QUANTITY_QUI],
            children: [
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.H2,
                    text: 'Resultados das Avaliações de Agentes Químicos',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: 'A seguir são apresentados os resultados quantitativos de exposição a Vibração de Mãos e Braços.',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: 'Conforme explicitado no ‘item’ 6.4 do Documento Base os critérios de aceitabilidade para o RO de Vibração de Mãos e Braços são:',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    text: '**Inaceitável (RO: Muito Alto):** MVUE > LT ou IJ > 1,0',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    text: '**Temporariamente Aceitável (RO: Alto):** Nível de Ação < MVUE < LT ou 0,5 < IJ < 1,0',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    text: '**Aceitável (RO: Moderado):** 0,25 ≤ IJ < 0,5',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    text: '**Aceitável (RO: Baixo):** 0,1 ≤ IJ 0,25',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    text: '**Aceitável (RO: Baixo):** IJ < 0,10',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.TABLE_QUANTITY_QUI,
                },
            ],
        },
    ],
};
//# sourceMappingURL=2.6.7-quantity-qui.js.map