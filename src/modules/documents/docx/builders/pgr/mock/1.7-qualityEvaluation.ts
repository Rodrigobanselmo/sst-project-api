import { VariablesPGREnum } from '../enums/variables.enum';
import { PGRSectionChildrenTypeEnum } from '../types/elements.types';
import { IDocumentPGRSectionGroup, PGRSectionTypeEnum } from '../types/section.types';

export const qualityEvaluation: IDocumentPGRSectionGroup = {
  footer: true,
  header: true,
  data: [
    {
      type: PGRSectionTypeEnum.SECTION,
      footerText: `??${VariablesPGREnum.CHAPTER_1}??`,
      children: [
        {
          type: PGRSectionChildrenTypeEnum.H2,
          text: 'Avaliação Qualitativa dos Perigo ou Fatores de Riscos Ocupacionais (NR-01 item 1.5.3.2 alínea c) / item 1.5.3.4)',
        },
        {
          type: PGRSectionChildrenTypeEnum.H3,
          text: 'Avaliação do Grau de Efeito à Saúde dos Perigo ou Fatores de Risco (Severidade)',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Deve-se selecionar as ferramentas e técnicas de avaliação de riscos adequadas às circunstâncias em avaliação. **(NR-01 item 1.5.3.4.4.2.1).**',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Os Fatores de Risco são avaliados segundo os potenciais de efeitos adversos à saúde que porventura possam causar. É utilizada as seguintes classificações de efeitos para os Fatores de Riscos:',
        },
        {
          type: PGRSectionChildrenTypeEnum.HEALTH_EFFECT_TABLES,
        },
        {
          type: PGRSectionChildrenTypeEnum.BREAK,
        },
        {
          type: PGRSectionChildrenTypeEnum.H2,
          text: 'Avaliação do Grau de Exposição Estimados – GEE (Probabilidade)',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Para determinação do Grau de Exposição Estimado (GEE) dos trabalhadores é feita uma avaliação qualitativa da exposição aos diversos agentes, com base em dados de avaliações de exposição anteriores (se existirem), nas concentrações e quantidades movimentadas/manipuladas dos agentes químicos e/ou biológicos, na intensidade dos agentes físicos, no categoria de atividade executada, no local e nas condições de emissão e dispersão do agente e do tempo de exposição. ',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Para a graduação estimada da exposição, será utilizada a classificação das tabelas apresentadas a seguir:',
        },
        {
          type: PGRSectionChildrenTypeEnum.EXPOSITION_DEGREE_TABLES,
        },
        {
          type: PGRSectionChildrenTypeEnum.BREAK,
        },
        {
          type: PGRSectionChildrenTypeEnum.H2,
          text: 'Risco Ocupacional (RO) “Potencial de Risco” (NR-01 item 1.5.3.4.4.2)',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'O Risco Ocupacional é o resultado da Avaliação Qualitativa (“Potencial de Risco”) de cada Grupo Similar de Exposição – GSE, em relação a cada ator de Risco. Será obtido cruzando o GEE – Grau de Exposição Estimado do Trabalhador (Probabilidade) com o GES – Grau de Efeito à Saúde (Severidade) do Fator de Risco, conforme a Matriz de Risco Ocupacionais apresentada a seguir.',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH_TABLE,
          text: 'Matriz de Riscos Ocupacionais (RO) “Potencial de Risco” (RO = Severidade x Probabilidade)',
        },
        {
          type: PGRSectionChildrenTypeEnum.MATRIX_TABLES,
        },
        {
          type: PGRSectionChildrenTypeEnum.LEGEND,
          text: '**Fonte:** [AIHA - A Strategy for Assessing and Managing Occupational Exposures, 2015]',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'A Categoria de Risco de Exposição, assim como a frequência de monitoramento dos GSE’s aos Fatores de Riscos são classificados com base em resultados de avaliações quantitativas, sendo o Julgamento (IJ) o parâmetro de referência.',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'O Julgamento (IJ) é calculado pela relação entre o MVUE (parâmetro estatístico) e o Limite de Tolerância mais restritivo dentre aqueles da NR-15 e ACGIH.',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: `Os critérios aqui apresentados foram baseados nas boas práticas de Higiene Ocupacional e resultado da análise técnica dos profissionais responsáveis pela elaboração deste documento em conjunto com a ??${VariablesPGREnum.COMPANY_SHORT_NAME}??.`,
        },
        {
          type: PGRSectionChildrenTypeEnum.BREAK,
        },
        {
          type: PGRSectionChildrenTypeEnum.H2,
          text: `Avaliação Quantitativa do Risco Ocupacional (NR-01 item 1.5.3.2 alínea c)`,
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: `Quando o agente de risco for avaliado quantitativamente o RO calculado por tratamento estatístico deverá prevalecer em relação ao qualitativo. A seguir são apresentados os critérios para determinação do Risco Ocupacional por avaliação quantitativa.`,
        },
        {
          type: PGRSectionChildrenTypeEnum.QUANTITY_RESULTS_TABLES,
        },
      ],
    },
  ],
};
//??${VariablesPGREnum.COMPANY_SHORT_NAME}??
