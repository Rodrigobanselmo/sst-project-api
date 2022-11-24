"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quantitySection = void 0;
const variables_enum_1 = require("../enums/variables.enum");
const elements_types_1 = require("../types/elements.types");
const section_types_1 = require("../types/section.types");
exports.quantitySection = {
    footer: true,
    header: true,
    data: [
        {
            type: section_types_1.PGRSectionTypeEnum.SECTION,
            footerText: `??${variables_enum_1.VariablesPGREnum.CHAPTER_3}??`,
            removeWithSomeEmptyVars: [variables_enum_1.VariablesPGREnum.HAS_QUANTITY],
            children: [
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.H1,
                    text: 'AVALIAÇÃO QUANTITATIVA DOS RISCOS (NR-01 ‘item’ 1.5.3.2 alínea c)',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: 'Esta seção do PGR tem como objetivo registrar dados quantitativos de monitoramentos para exposição ocupacional, permitindo um acompanhamento, com melhor visibilidade de questões relacionadas com a área de higiene ocupacional. Do mesmo modo que a Aviação Qualitativa determina o Risco Ocupacional (Potencial de Risco) os resultados das Avaliações Quantitativas quando realizadas por meio de uma estratégia de amostragem tecnicamente embasa refletem o Potencial de Risco de forma ainda mais precisa.',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: "Um resumo parcial dos resultados obtidos nas campanhas mais recentes para avaliação de exposição ocupacional, além do Risco Ocupacional correspondente, conforme critérios do Programa de Monitoramento Ambiental e Pessoal é apresentado a seguir, para cada um dos GSE's e/ou cargos contemplados neste PGR.",
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: 'Maiores detalhes das campanhas de monitoramento e dos resultados de avaliações quantitativas de outros agentes, que não os apresentados abaixo, podem ser obtidos através da Gerência de Segurança e Sustentabilidade.',
                },
            ],
        },
    ],
};
//# sourceMappingURL=2.6.1-quantity.js.map