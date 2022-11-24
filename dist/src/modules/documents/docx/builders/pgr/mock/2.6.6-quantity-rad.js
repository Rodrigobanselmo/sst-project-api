"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quantityRadSection = void 0;
const variables_enum_1 = require("../enums/variables.enum");
const elements_types_1 = require("../types/elements.types");
const section_types_1 = require("../types/section.types");
exports.quantityRadSection = {
    footer: true,
    header: true,
    data: [
        {
            type: section_types_1.PGRSectionTypeEnum.SECTION,
            footerText: `??${variables_enum_1.VariablesPGREnum.CHAPTER_3}??`,
            removeWithSomeEmptyVars: [variables_enum_1.VariablesPGREnum.HAS_QUANTITY_RAD],
            children: [
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.H2,
                    text: 'Resultados Avaliações Agente Físico – Radiações Ionizantes',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: 'A seguir são apresentados os resultados quantitativos de exposição a Radiações Ionizantes, Conforme explicitado no ‘item’ 6.4 do Documento Base os critérios de aceitabilidade para o RO de Radiações Ionizantes:',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH_TABLE,
                    text: 'Resultados Avaliações Agente Físico – Radiações Ionizantes',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.TABLE_QUANTITY_RAD,
                },
            ],
        },
    ],
};
//# sourceMappingURL=2.6.6-quantity-rad.js.map