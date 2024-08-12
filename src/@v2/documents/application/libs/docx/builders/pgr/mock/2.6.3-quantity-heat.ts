import { VariablesPGREnum } from '../enums/variables.enum';
import { DocumentSectionChildrenTypeEnum } from '../types/elements.types';
import { IDocumentPGRSectionGroup, DocumentSectionTypeEnum } from '../types/section.types';

export const quantityHeatSection: IDocumentPGRSectionGroup = {
  data: [
    {
      type: DocumentSectionTypeEnum.SECTION,
      footerText: `??${VariablesPGREnum.CHAPTER_3}??`,
      removeWithSomeEmptyVars: [VariablesPGREnum.HAS_QUANTITY_HEAT],
      children: [
        {
          type: DocumentSectionChildrenTypeEnum.H2,
          text: 'Resultados Avaliações Agente Físico – CALOR (Sobrecarga Térmica)',
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: 'A seguir são apresentados os resultados quantitativos de exposição ao calor, para detalhamento do ciclo de exposição ver Relatório Técnico de Exposição Ocupacional ao Calor.',
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Conforme explicitado no ‘item’ 6.4 do Documento Base os critérios de aceitabilidade para o RO do Calor são:',
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: '**Inaceitável (RO: Muito Alto):** Acima do limite de exposição. (IBUTG > LE).',
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: '**Temporariamente Aceitável (RO: Alto):** Região de incerteza. (LII < IBUTG < LSI).',
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: '**Aceitável (RO: Moderado):** Acima do nível de ação.  (> NA < IBUTG < LII).',
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: '**Aceitável (RO: Baixo):** Aceitável (IBUTG < NA).',
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH_TABLE,
          text: 'Resultados das Avaliações de Calor',
        },
        {
          type: DocumentSectionChildrenTypeEnum.TABLE_QUANTITY_HEAT,
        },
      ],
    },
  ],
};
