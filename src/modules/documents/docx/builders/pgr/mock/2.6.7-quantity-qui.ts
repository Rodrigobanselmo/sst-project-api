import { VariablesPGREnum } from '../enums/variables.enum';
import { PGRSectionChildrenTypeEnum } from '../types/elements.types';
import {
  IDocumentPGRSectionGroup,
  PGRSectionTypeEnum,
} from '../types/section.types';

export const quantityQuiSection: IDocumentPGRSectionGroup = {
  footer: true,
  header: true,
  data: [
    {
      type: PGRSectionTypeEnum.SECTION,
      footerText: `??${VariablesPGREnum.CHAPTER_3}??`,
      removeWithSomeEmptyVars: [VariablesPGREnum.HAS_QUANTITY_VFB],
      children: [
        {
          type: PGRSectionChildrenTypeEnum.H2,
          text: 'Resultados das Avaliações de Agentes Químicos',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'A seguir são apresentados os resultados quantitativos de exposição a Vibração de Mãos e Braços.',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Conforme explicitado no ‘item’ 6.4 do Documento Base os critérios de aceitabilidade para o RO de Vibração de Mãos e Braços são:',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: '**Inaceitável (RO: Muito Alto):** MVUE > LT ou IJ > 1,0',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: '**Temporariamente Aceitável (RO: Alto):** Nível de Ação < MVUE < LT ou 0,5 < IJ < 1,0',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: '**Aceitável (RO: Moderado):** 0,25 ≤ IJ < 0,5',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: '**Aceitável (RO: Baixo):** 0,1 ≤ IJ 0,25',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: '**Aceitável (RO: Baixo):** IJ < 0,10',
        },
        {
          type: PGRSectionChildrenTypeEnum.TABLE_QUANTITY_QUI,
        },
      ],
    },
  ],
};
