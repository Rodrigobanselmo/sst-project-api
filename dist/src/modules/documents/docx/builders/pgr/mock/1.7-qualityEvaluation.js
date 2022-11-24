"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.qualityEvaluation = void 0;
const variables_enum_1 = require("../enums/variables.enum");
const elements_types_1 = require("../types/elements.types");
const section_types_1 = require("../types/section.types");
exports.qualityEvaluation = {
    footer: true,
    header: true,
    data: [
        {
            type: section_types_1.PGRSectionTypeEnum.SECTION,
            footerText: `??${variables_enum_1.VariablesPGREnum.CHAPTER_1}??`,
            children: [
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.H2,
                    text: 'Avaliação Qualitativa dos Perigo ou Fatores de Riscos Ocupacionais (NR-01 item 1.5.3.2 alínea c) / item 1.5.3.4)',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.H3,
                    text: 'Avaliação do Grau de Efeito à Saúde dos Perigo ou Fatores de Risco (Severidade)',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: 'Deve-se selecionar as ferramentas e técnicas de avaliação de riscos adequadas às circunstâncias em avaliação. **(NR-01 item 1.5.3.4.4.2.1).**',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: 'Os Fatores de Risco são avaliados segundo os potenciais de efeitos adversos à saúde que porventura possam causar. É utilizada as seguintes classificações de efeitos para os Fatores de Riscos:',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.HEALTH_EFFECT_TABLES,
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BREAK,
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.H2,
                    text: 'Avaliação do Grau de Exposição Estimados – GEE (Probabilidade)',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: 'Para determinação do Grau de Exposição Estimado (GEE) dos trabalhadores é feita uma avaliação qualitativa da exposição aos diversos agentes, com base em dados de avaliações de exposição anteriores (se existirem), nas concentrações e quantidades movimentadas/manipuladas dos agentes químicos e/ou biológicos, na intensidade dos agentes físicos, no categoria de atividade executada, no local e nas condições de emissão e dispersão do agente e do tempo de exposição. ',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: 'Para a graduação estimada da exposição, será utilizada a classificação das tabelas apresentadas a seguir:',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.EXPOSITION_DEGREE_TABLES,
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BREAK,
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.H2,
                    text: 'Risco Ocupacional (RO) “Potencial de Risco” (NR-01 item 1.5.3.4.4.2)',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: 'O Risco Ocupacional é o resultado da Avaliação Qualitativa (“Potencial de Risco”) de cada Grupo Similar de Exposição – GSE, em relação a cada ator de Risco. Será obtido cruzando o GEE – Grau de Exposição Estimado do Trabalhador (Probabilidade) com o GES – Grau de Efeito à Saúde (Severidade) do Fator de Risco, conforme a Matriz de Risco Ocupacionais apresentada a seguir.',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH_TABLE,
                    text: 'Matriz de Riscos Ocupacionais (RO) “Potencial de Risco” (RO = Severidade x Probabilidade)',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.MATRIX_TABLES,
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.LEGEND,
                    text: '**Fonte:** [AIHA - A Strategy for Assessing and Managing Occupational Exposures, 2015]',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: 'A Categoria de Risco de Exposição, assim como a frequência de monitoramento dos GSE’s aos Fatores de Riscos são classificados com base em resultados de avaliações quantitativas, sendo o Julgamento (IJ) o parâmetro de referência.',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: 'O Julgamento (IJ) é calculado pela relação entre o MVUE (parâmetro estatístico) e o Limite de Tolerância mais restritivo dentre aqueles da NR-15 e ACGIH.',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: `Os critérios aqui apresentados foram baseados nas boas práticas de Higiene Ocupacional e resultado da análise técnica dos profissionais responsáveis pela elaboração deste documento em conjunto com a ??${variables_enum_1.VariablesPGREnum.COMPANY_SHORT_NAME}??.`,
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BREAK,
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.H2,
                    text: `Avaliação Quantitativa do Risco Ocupacional (NR-01 item 1.5.3.2 alínea c)`,
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: `Quando o agente de risco for avaliado quantitativamente o RO calculado por tratamento estatístico deverá prevalecer em relação ao qualitativo. A seguir são apresentados os critérios para determinação do Risco Ocupacional por avaliação quantitativa.`,
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.QUANTITY_RESULTS_TABLES,
                },
            ],
        },
    ],
};
//# sourceMappingURL=1.7-qualityEvaluation.js.map