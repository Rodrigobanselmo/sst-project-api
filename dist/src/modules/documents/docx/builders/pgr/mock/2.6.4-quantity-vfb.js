"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quantityVFBSection = void 0;
const variables_enum_1 = require("../enums/variables.enum");
const elements_types_1 = require("../types/elements.types");
const section_types_1 = require("../types/section.types");
exports.quantityVFBSection = {
    footer: true,
    header: true,
    data: [
        {
            type: section_types_1.PGRSectionTypeEnum.SECTION,
            footerText: `??${variables_enum_1.VariablesPGREnum.CHAPTER_3}??`,
            removeWithSomeEmptyVars: [variables_enum_1.VariablesPGREnum.HAS_QUANTITY_VFB],
            children: [
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.H2,
                    text: 'Resultados Avaliações Agente Físico – Vibração de Corpo Inteiro',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: 'A seguir são apresentados os resultados quantitativos de exposição a Vibração de Corpo Inteiro.',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: 'Conforme explicitado no ‘item’ 6.4 do Documento Base os critérios de aceitabilidade para o RO de Vibração de Corpo Inteiro são:',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    text: '**Inaceitável (RO: Muito Alto):** aren Acima de 1,1 m/s^2 e VDVR Acima de 21 m/s^1,75',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    text: '**Temporariamente Aceitável (RO: Alto):** aren 0,9 m/s^2 a 1,1 m/s^2 e VDVR 16,4 a 21 m/s^1,75',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    text: '**Aceitável (RO: Moderado):** aren > 0,5 m/s^2 a < 0,9 m/s^2 e VDVR > 9,1 a < 16,4 m/s^1,75',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    text: '**Aceitável (RO: Baixo):** aren 0,1 m/s^2 a 0,5 m/s^2 e VDVR 2,1 a 9,1 m/s^1,75',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    text: '**Aceitável (RO: Baixo):** aren < 0,1 m/s^2 e VDVR < 2,1 m/s^1,755',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.TABLE_QUANTITY_VFB,
                },
            ],
        },
    ],
};
//# sourceMappingURL=2.6.4-quantity-vfb.js.map