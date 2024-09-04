import { VariablesPGREnum } from '../enums/variables.enum';
import { DocumentChildrenTypeEnum as DocumentSectionChildrenTypeEnum } from '@/@v2/documents/domain/enums/document-children-type.enum';
import { IDocumentPGRSectionGroup } from '../../../../../../domain/types/section.types';
import { DocumentSectionTypeEnum } from '@/@v2/documents/domain/enums/document-section-type.enum';

export const quantitySection: IDocumentPGRSectionGroup = {
  data: [
    {
      type: DocumentSectionTypeEnum.SECTION,
      footerText: `??${VariablesPGREnum.CHAPTER_3}??`,
      removeWithSomeEmptyVars: [VariablesPGREnum.HAS_QUANTITY],
      children: [
        {
          type: DocumentSectionChildrenTypeEnum.H1,
          text: 'AVALIAÇÃO QUANTITATIVA DOS RISCOS (NR-01 ‘item’ 1.5.3.2 alínea c)',
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Esta seção do PGR tem como objetivo registrar dados quantitativos de monitoramentos para exposição ocupacional, permitindo um acompanhamento, com melhor visibilidade de questões relacionadas com a área de higiene ocupacional. Do mesmo modo que a Aviação Qualitativa determina o Risco Ocupacional (Potencial de Risco) os resultados das Avaliações Quantitativas quando realizadas por meio de uma estratégia de amostragem tecnicamente embasa refletem o Potencial de Risco de forma ainda mais precisa.',
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: "Um resumo parcial dos resultados obtidos nas campanhas mais recentes para avaliação de exposição ocupacional, além do Risco Ocupacional correspondente, conforme critérios do Programa de Monitoramento Ambiental e Pessoal é apresentado a seguir, para cada um dos GSE's e/ou cargos contemplados neste PGR.",
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Maiores detalhes das campanhas de monitoramento e dos resultados de avaliações quantitativas de outros agentes, que não os apresentados abaixo, podem ser obtidos através da Gerência de Segurança e Sustentabilidade.',
        },
      ],
    },
  ],
};
