import { VariablesPGREnum } from '../enums/variables.enum';
import { PGRSectionChildrenTypeEnum } from '../types/elements.types';
import {
  IDocumentPGRSectionGroup,
  PGRSectionTypeEnum,
} from '../types/section.types';

export const quantityNoiseSection: IDocumentPGRSectionGroup = {
  footer: true,
  header: true,
  data: [
    {
      type: PGRSectionTypeEnum.SECTION,
      footerText: `??${VariablesPGREnum.CHAPTER_3}??`,
      removeWithSomeEmptyVars: [VariablesPGREnum.HAS_QUANTITY_NOISE],
      children: [
        {
          type: PGRSectionChildrenTypeEnum.H2,
          text: 'Resultados Avaliações Agente Físico – RUÍDO',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Os resultados de médias apresentados abaixo foram calculados inicialmente a partir da dose e, posteriormente, transformadas na unidade de dB (A).',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Conforme explicitado no ‘item’ 6.4 do Documento Base os critérios de aceitabilidade para o RO do ruído são:',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: '**Inaceitável (RO: Muito Alto):** MVUE ≥ 85,0 dB(A)',
          removeWithAllValidVars: [VariablesPGREnum.IS_Q5],
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: '**Temporariamente Aceitável (RO: Alto):** 82,0dB(A) ≤ MVUE < 85,0 dB(A)',
          removeWithAllValidVars: [VariablesPGREnum.IS_Q5],
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: '**Aceitável (RO: Moderado):** 79,0 dB(A) ≤ MVUE < 82,0 dB(A)',
          removeWithAllValidVars: [VariablesPGREnum.IS_Q5],
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: '**Aceitável (RO: Baixo):** 75,0 dB(A) ≤ MVUE < 79,0 dB(A)',
          removeWithAllValidVars: [VariablesPGREnum.IS_Q5],
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: '**Aceitável (RO: Baixo):** MVUE < 75,0 dB(A)',
          removeWithAllValidVars: [VariablesPGREnum.IS_Q5],
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: '**Inaceitável (RO: Muito Alto):** MVUE ≥ LT [85 dB (A)]',
          removeWithSomeEmptyVars: [VariablesPGREnum.IS_Q5],
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: '**Temporariamente Aceitável (RO: Alto):** 50% LT – Nível de Ação [80 dB (A)] ≤ MVUE < LT [85 dB (A)]',
          removeWithSomeEmptyVars: [VariablesPGREnum.IS_Q5],
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: '**Aceitável (RO: Moderado):** 25% LT ≤ MVUE < 50% LT – Nível de Ação [80 dB (A)]',
          removeWithSomeEmptyVars: [VariablesPGREnum.IS_Q5],
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: '**Aceitável (RO: Baixo):** 10% LT ≤ MVUE 25% LT [75 dB (A)]',
          removeWithSomeEmptyVars: [VariablesPGREnum.IS_Q5],
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: '**Aceitável (RO: Baixo):** MVUE < 10% LT [68,4 dB (A)]',
          removeWithSomeEmptyVars: [VariablesPGREnum.IS_Q5],
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH_TABLE,
          text: 'Avaliações Quantitativas de Ruído (Dosimetrias)',
        },
        {
          type: PGRSectionChildrenTypeEnum.TABLE_QUANTITY_NOISE,
        },
      ],
    },
  ],
};
