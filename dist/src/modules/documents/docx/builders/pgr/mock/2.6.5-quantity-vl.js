"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quantityVLSection = void 0;
const variables_enum_1 = require("../enums/variables.enum");
const elements_types_1 = require("../types/elements.types");
const section_types_1 = require("../types/section.types");
exports.quantityVLSection = {
    footer: true,
    header: true,
    data: [
        {
            type: section_types_1.PGRSectionTypeEnum.SECTION,
            footerText: `??${variables_enum_1.VariablesPGREnum.CHAPTER_3}??`,
            removeWithSomeEmptyVars: [variables_enum_1.VariablesPGREnum.HAS_QUANTITY_VL],
            children: [
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.H2,
                    text: 'Resultados Avaliações Agente Físico – Vibração de Mãos e Braços',
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
                    text: '**Inaceitável (RO: Muito Alto):** aren Acima de 5,0 m/s^2',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    text: '**Temporariamente Aceitável (RO: Alto):** aren 3,5 m/s^2 a 5,0 m/s^2',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    text: '**Aceitável (RO: Moderado):** aren > 2,5 m/s^2 a < 3,5 m/s^2',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    text: '**Aceitável (RO: Baixo):** aren 0,5 m/s^2 a 2,5 m/s^2',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    text: '**Aceitável (RO: Muito Baixo):** aren < 0,5 m/s^2',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.TABLE_QUANTITY_VL,
                },
            ],
        },
    ],
};
//# sourceMappingURL=2.6.5-quantity-vl.js.map