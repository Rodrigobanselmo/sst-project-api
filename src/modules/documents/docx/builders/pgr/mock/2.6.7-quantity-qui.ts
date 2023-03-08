import { VariablesPGREnum } from '../enums/variables.enum';
import { DocumentSectionChildrenTypeEnum } from '../types/elements.types';
import { IDocumentPGRSectionGroup, DocumentSectionTypeEnum } from '../types/section.types';

export const quantityQuiSection: IDocumentPGRSectionGroup = {
  data: [
    {
      type: DocumentSectionTypeEnum.SECTION,
      footerText: `??${VariablesPGREnum.CHAPTER_3}??`,
      removeWithSomeEmptyVars: [VariablesPGREnum.HAS_QUANTITY_QUI],
      children: [
        {
          type: DocumentSectionChildrenTypeEnum.H2,
          text: 'Resultados das Avaliações de Agentes Químicos',
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: 'A seguir são apresentados os resultados quantitativos de exposição a Vibração de Mãos e Braços.',
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Conforme explicitado no ‘item’ 6.4 do Documento Base os critérios de aceitabilidade para o RO de Vibração de Mãos e Braços são:',
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: '**Inaceitável (RO: Muito Alto):** MVUE > LT ou IJ > 1,0',
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: '**Temporariamente Aceitável (RO: Alto):** Nível de Ação < MVUE < LT ou 0,5 < IJ < 1,0',
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: '**Aceitável (RO: Moderado):** 0,25 ≤ IJ < 0,5',
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: '**Aceitável (RO: Baixo):** 0,1 ≤ IJ 0,25',
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: '**Aceitável (RO: Baixo):** IJ < 0,10',
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH_TABLE,
          text: 'Avaliações Quantitativas dos Riscos Químicos',
        },
        {
          type: DocumentSectionChildrenTypeEnum.TABLE_QUANTITY_QUI,
        },
      ],
    },
  ],
};
