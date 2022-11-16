import { VariablesPGREnum } from '../enums/variables.enum';
import { PGRSectionChildrenTypeEnum } from '../types/elements.types';
import { IDocumentPGRSectionGroup, PGRSectionTypeEnum } from '../types/section.types';

export const quantityHeatSection: IDocumentPGRSectionGroup = {
  footer: true,
  header: true,
  data: [
    {
      type: PGRSectionTypeEnum.SECTION,
      footerText: `??${VariablesPGREnum.CHAPTER_3}??`,
      removeWithSomeEmptyVars: [VariablesPGREnum.HAS_QUANTITY_HEAT],
      children: [
        {
          type: PGRSectionChildrenTypeEnum.H2,
          text: 'Resultados Avaliações Agente Físico – CALOR (Sobrecarga Térmica)',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'A seguir são apresentados os resultados quantitativos de exposição ao calor, para detalhamento do ciclo de exposição ver Relatório Técnico de Exposição Ocupacional ao Calor.',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Conforme explicitado no ‘item’ 6.4 do Documento Base os critérios de aceitabilidade para o RO do Calor são:',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: '**Inaceitável (RO: Muito Alto):** Acima do limite de exposição. (IBUTG > LE).',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: '**Temporariamente Aceitável (RO: Alto):** Região de incerteza. (LII < IBUTG < LSI).',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: '**Aceitável (RO: Moderado):** Acima do nível de ação.  (> NA < IBUTG < LII).',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: '**Aceitável (RO: Baixo):** Aceitável (IBUTG < NA).',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH_TABLE,
          text: 'Resultados das Avaliações de Calor',
        },
        {
          type: PGRSectionChildrenTypeEnum.TABLE_QUANTITY_HEAT,
        },
      ],
    },
  ],
};
