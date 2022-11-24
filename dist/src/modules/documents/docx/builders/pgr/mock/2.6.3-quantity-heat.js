"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quantityHeatSection = void 0;
const variables_enum_1 = require("../enums/variables.enum");
const elements_types_1 = require("../types/elements.types");
const section_types_1 = require("../types/section.types");
exports.quantityHeatSection = {
    footer: true,
    header: true,
    data: [
        {
            type: section_types_1.PGRSectionTypeEnum.SECTION,
            footerText: `??${variables_enum_1.VariablesPGREnum.CHAPTER_3}??`,
            removeWithSomeEmptyVars: [variables_enum_1.VariablesPGREnum.HAS_QUANTITY_HEAT],
            children: [
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.H2,
                    text: 'Resultados Avaliações Agente Físico – CALOR (Sobrecarga Térmica)',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: 'A seguir são apresentados os resultados quantitativos de exposição ao calor, para detalhamento do ciclo de exposição ver Relatório Técnico de Exposição Ocupacional ao Calor.',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: 'Conforme explicitado no ‘item’ 6.4 do Documento Base os critérios de aceitabilidade para o RO do Calor são:',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    text: '**Inaceitável (RO: Muito Alto):** Acima do limite de exposição. (IBUTG > LE).',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    text: '**Temporariamente Aceitável (RO: Alto):** Região de incerteza. (LII < IBUTG < LSI).',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    text: '**Aceitável (RO: Moderado):** Acima do nível de ação.  (> NA < IBUTG < LII).',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    text: '**Aceitável (RO: Baixo):** Aceitável (IBUTG < NA).',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH_TABLE,
                    text: 'Resultados das Avaliações de Calor',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.TABLE_QUANTITY_HEAT,
                },
            ],
        },
    ],
};
//# sourceMappingURL=2.6.3-quantity-heat.js.map