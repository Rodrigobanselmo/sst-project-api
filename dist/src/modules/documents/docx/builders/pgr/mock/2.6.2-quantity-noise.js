"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quantityNoiseSection = void 0;
const variables_enum_1 = require("../enums/variables.enum");
const elements_types_1 = require("../types/elements.types");
const section_types_1 = require("../types/section.types");
exports.quantityNoiseSection = {
    footer: true,
    header: true,
    data: [
        {
            type: section_types_1.PGRSectionTypeEnum.SECTION,
            footerText: `??${variables_enum_1.VariablesPGREnum.CHAPTER_3}??`,
            removeWithSomeEmptyVars: [variables_enum_1.VariablesPGREnum.HAS_QUANTITY_NOISE],
            children: [
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.H2,
                    text: 'Resultados Avaliações Agente Físico – RUÍDO',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: 'Os resultados de médias apresentados abaixo foram calculados inicialmente a partir da dose e, posteriormente, transformadas na unidade de dB (A).',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: 'Conforme explicitado no ‘item’ 6.4 do Documento Base os critérios de aceitabilidade para o RO do ruído são:',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    text: '**Inaceitável (RO: Muito Alto):** MVUE ≥ 85,0 dB(A)',
                    removeWithAllValidVars: [variables_enum_1.VariablesPGREnum.IS_Q5],
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    text: '**Temporariamente Aceitável (RO: Alto):** 82,0dB(A) ≤ MVUE < 85,0 dB(A)',
                    removeWithAllValidVars: [variables_enum_1.VariablesPGREnum.IS_Q5],
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    text: '**Aceitável (RO: Moderado):** 79,0 dB(A) ≤ MVUE < 82,0 dB(A)',
                    removeWithAllValidVars: [variables_enum_1.VariablesPGREnum.IS_Q5],
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    text: '**Aceitável (RO: Baixo):** 75,0 dB(A) ≤ MVUE < 79,0 dB(A)',
                    removeWithAllValidVars: [variables_enum_1.VariablesPGREnum.IS_Q5],
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    text: '**Aceitável (RO: Baixo):** MVUE < 75,0 dB(A)',
                    removeWithAllValidVars: [variables_enum_1.VariablesPGREnum.IS_Q5],
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    text: '**Inaceitável (RO: Muito Alto):** MVUE ≥ LT [85 dB (A)]',
                    removeWithSomeEmptyVars: [variables_enum_1.VariablesPGREnum.IS_Q5],
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    text: '**Temporariamente Aceitável (RO: Alto):** 50% LT – Nível de Ação [80 dB (A)] ≤ MVUE < LT [85 dB (A)]',
                    removeWithSomeEmptyVars: [variables_enum_1.VariablesPGREnum.IS_Q5],
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    text: '**Aceitável (RO: Moderado):** 25% LT ≤ MVUE < 50% LT – Nível de Ação [80 dB (A)]',
                    removeWithSomeEmptyVars: [variables_enum_1.VariablesPGREnum.IS_Q5],
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    text: '**Aceitável (RO: Baixo):** 10% LT ≤ MVUE 25% LT [75 dB (A)]',
                    removeWithSomeEmptyVars: [variables_enum_1.VariablesPGREnum.IS_Q5],
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    text: '**Aceitável (RO: Baixo):** MVUE < 10% LT [68,4 dB (A)]',
                    removeWithSomeEmptyVars: [variables_enum_1.VariablesPGREnum.IS_Q5],
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH_TABLE,
                    text: 'Avaliações Quantitativas de Ruído (Dosimetrias)',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.TABLE_QUANTITY_NOISE,
                },
            ],
        },
    ],
};
//# sourceMappingURL=2.6.2-quantity-noise.js.map