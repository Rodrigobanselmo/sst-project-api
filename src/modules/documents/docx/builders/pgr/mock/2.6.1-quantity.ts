import { VariablesPGREnum } from '../enums/variables.enum';
import { PGRSectionChildrenTypeEnum } from '../types/elements.types';
import { IDocumentPGRSectionGroup, PGRSectionTypeEnum } from '../types/section.types';

export const quantitySection: IDocumentPGRSectionGroup = {
  footer: true,
  header: true,
  data: [
    {
      type: PGRSectionTypeEnum.SECTION,
      footerText: `??${VariablesPGREnum.CHAPTER_3}??`,
      removeWithSomeEmptyVars: [VariablesPGREnum.HAS_QUANTITY],
      children: [
        {
          type: PGRSectionChildrenTypeEnum.H1,
          text: 'AVALIAÇÃO QUANTITATIVA DOS RISCOS (NR-01 ‘item’ 1.5.3.2 alínea c)',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Esta seção do PGR tem como objetivo registrar dados quantitativos de monitoramentos para exposição ocupacional, permitindo um acompanhamento, com melhor visibilidade de questões relacionadas com a área de higiene ocupacional. Do mesmo modo que a Aviação Qualitativa determina o Risco Ocupacional (Potencial de Risco) os resultados das Avaliações Quantitativas quando realizadas por meio de uma estratégia de amostragem tecnicamente embasa refletem o Potencial de Risco de forma ainda mais precisa.',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: "Um resumo parcial dos resultados obtidos nas campanhas mais recentes para avaliação de exposição ocupacional, além do Risco Ocupacional correspondente, conforme critérios do Programa de Monitoramento Ambiental e Pessoal é apresentado a seguir, para cada um dos GSE's e/ou cargos contemplados neste PGR.",
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Maiores detalhes das campanhas de monitoramento e dos resultados de avaliações quantitativas de outros agentes, que não os apresentados abaixo, podem ser obtidos através da Gerência de Segurança e Sustentabilidade.',
        },
      ],
    },
  ],
};
