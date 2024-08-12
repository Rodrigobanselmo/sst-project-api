import { VariablesPGREnum } from '../enums/variables.enum';
import { DocumentSectionChildrenTypeEnum } from '../types/elements.types';
import { IDocumentPGRSectionGroup, DocumentSectionTypeEnum } from '../types/section.types';

export const qualityEvaluation: IDocumentPGRSectionGroup = {
  data: [
    {
      type: DocumentSectionTypeEnum.SECTION,
      footerText: `??${VariablesPGREnum.CHAPTER_1}??`,
      children: [
        {
          type: DocumentSectionChildrenTypeEnum.H2,
          text: 'Avaliação Qualitativa dos Perigo ou Fatores de Riscos Ocupacionais (NR-01 item 1.5.3.2 alínea c) / item 1.5.3.4)',
        },
        {
          type: DocumentSectionChildrenTypeEnum.H3,
          text: 'Avaliação do Grau de Efeito à Saúde dos Perigo ou Fatores de Risco (Severidade)',
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Deve-se selecionar as ferramentas e técnicas de avaliação de riscos adequadas às circunstâncias em avaliação. **(NR-01 item 1.5.3.4.4.2.1).**',
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Os Fatores de Risco são avaliados segundo os potenciais de efeitos adversos à saúde que porventura possam causar. É utilizada as seguintes classificações de efeitos para os Fatores de Riscos:',
        },
        {
          type: DocumentSectionChildrenTypeEnum.HEALTH_EFFECT_TABLES,
        },
        {
          type: DocumentSectionChildrenTypeEnum.BREAK,
        },
        {
          type: DocumentSectionChildrenTypeEnum.H2,
          text: 'Avaliação do Grau de Exposição Estimados – GEE (Probabilidade)',
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Para determinação do Grau de Exposição Estimado (GEE) dos trabalhadores é feita uma avaliação qualitativa da exposição aos diversos agentes, com base em dados de avaliações de exposição anteriores (se existirem), nas concentrações e quantidades movimentadas/manipuladas dos agentes químicos e/ou biológicos, na intensidade dos agentes físicos, no categoria de atividade executada, no local e nas condições de emissão e dispersão do agente e do tempo de exposição. ',
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Para a graduação estimada da exposição, será utilizada a classificação das tabelas apresentadas a seguir:',
        },
        {
          type: DocumentSectionChildrenTypeEnum.EXPOSITION_DEGREE_TABLES,
        },
        {
          type: DocumentSectionChildrenTypeEnum.BREAK,
        },
        {
          type: DocumentSectionChildrenTypeEnum.H2,
          text: 'Risco Ocupacional (RO) “Potencial de Risco” (NR-01 item 1.5.3.4.4.2)',
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: 'O Risco Ocupacional é o resultado da Avaliação Qualitativa (“Potencial de Risco”) de cada Grupo Similar de Exposição – GSE, em relação a cada ator de Risco. Será obtido cruzando o GEE – Grau de Exposição Estimado do Trabalhador (Probabilidade) com o GES – Grau de Efeito à Saúde (Severidade) do Fator de Risco, conforme a Matriz de Risco Ocupacionais apresentada a seguir.',
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH_TABLE,
          text: 'Matriz de Riscos Ocupacionais (RO) “Potencial de Risco” (RO = Severidade x Probabilidade)',
        },
        {
          type: DocumentSectionChildrenTypeEnum.MATRIX_TABLES,
        },
        {
          type: DocumentSectionChildrenTypeEnum.LEGEND,
          text: '**Fonte:** [AIHA - A Strategy for Assessing and Managing Occupational Exposures, 2015]',
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: 'A Categoria de Risco de Exposição, assim como a frequência de monitoramento dos GSE’s aos Fatores de Riscos são classificados com base em resultados de avaliações quantitativas, sendo o Julgamento (IJ) o parâmetro de referência.',
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: 'O Julgamento (IJ) é calculado pela relação entre o MVUE (parâmetro estatístico) e o Limite de Tolerância mais restritivo dentre aqueles da NR-15 e ACGIH.',
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: `Os critérios aqui apresentados foram baseados nas boas práticas de Higiene Ocupacional e resultado da análise técnica dos profissionais responsáveis pela elaboração deste documento em conjunto com a ??${VariablesPGREnum.COMPANY_SHORT_NAME}??.`,
        },
        {
          type: DocumentSectionChildrenTypeEnum.BREAK,
        },
        {
          type: DocumentSectionChildrenTypeEnum.H2,
          text: `Avaliação Quantitativa do Risco Ocupacional (NR-01 item 1.5.3.2 alínea c)`,
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: `Quando o agente de risco for avaliado quantitativamente o RO calculado por tratamento estatístico deverá prevalecer em relação ao qualitativo. A seguir são apresentados os critérios para determinação do Risco Ocupacional por avaliação quantitativa.`,
        },
        {
          type: DocumentSectionChildrenTypeEnum.QUANTITY_RESULTS_TABLES,
        },
        {
          type: DocumentSectionChildrenTypeEnum.BREAK,
        },
        {
          type: DocumentSectionChildrenTypeEnum.H2,
          text: `Considerações Quanto aos Critérios Quantitativos`,
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: `Todos os cálculos apresentados nas tabelas acima tiveram como premissa a coleta de amostras obedecendo uma estratégia de amostragem que subsidia um resultado representativo da exposição real do trabalhador, seja por avaliação de GSE’s ou por Cargos, logo, pressupõem um tratamento estatístico dos dados coletados tendo como resultado um Desvio Padrão Geométrico (DPG) menor ou igual a 1,25, caso contrário os critérios de aceitabilidade, assim como, a frequência de avaliação precisam obedecer um novo valor de referencia para o Nível de Ação (NA) conforme apresentado na tabela a seguir.`,
        },
        {
          type: DocumentSectionChildrenTypeEnum.QUANTITY_CONSIDERATION_TABLES,
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: ``,
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: `Com base na tabela acima, o NA pode ser um parâmetro móvel e deve ser estabelecido para cada situação ou grupo de trabalhadoresavaliado, não sendo correto, portanto, o estabelecimento de um valorfixo. Na prática, valores de DPG abaixo de 1,3 indicam baixa variabilidadedas concentrações no ar e são dificilmente atingidos em atmosferascomplexas e de ambientes abertos. Por outro lado, valores de DPGentre 1,5 e 2,0 são mais encontrados, indicando que, ao se estabelecerum valor fixo, um nível de ação correspondente a 1/10 do limite seriao mais apropriado, pois estaria contemplando a maioria das situaçõesreais. Para valores de DPG acima de 2, a variabilidade já é muito grande e nenhum nível de ação pode ser sugerido. Nestas circunstâncias, medidas devem ser adotadas para reduzir a dispersão das concentrações. **(Guia Técnico sobre estratégia de amostragem e interpretação de resultados de avaliações quantitativas de agentes químicos em ambientes de trabalho – FUNDACENTRO 2018)**`,
        },
      ],
    },
  ],
};
//??${VariablesPGREnum.COMPANY_SHORT_NAME}??
