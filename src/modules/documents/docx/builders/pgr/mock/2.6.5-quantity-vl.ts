import { VariablesPGREnum } from '../enums/variables.enum';
import { DocumentSectionChildrenTypeEnum } from '../types/elements.types';
import { IDocumentPGRSectionGroup, DocumentSectionTypeEnum } from '../types/section.types';

export const quantityVLSection: IDocumentPGRSectionGroup = {
  data: [
    {
      type: DocumentSectionTypeEnum.SECTION,
      footerText: `??${VariablesPGREnum.CHAPTER_3}??`,
      removeWithSomeEmptyVars: [VariablesPGREnum.HAS_QUANTITY_VL],
      children: [
        {
          type: DocumentSectionChildrenTypeEnum.H2,
          text: 'Resultados Avaliações Agente Físico – Vibração de Mãos e Braços',
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
          text: '**Inaceitável (RO: Muito Alto):** aren Acima de 5,0 m/s^2',
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: '**Temporariamente Aceitável (RO: Alto):** aren 3,5 m/s^2 a 5,0 m/s^2',
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: '**Aceitável (RO: Moderado):** aren > 2,5 m/s^2 a < 3,5 m/s^2',
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: '**Aceitável (RO: Baixo):** aren 0,5 m/s^2 a 2,5 m/s^2',
        },
        {
          type: DocumentSectionChildrenTypeEnum.BULLET,
          text: '**Aceitável (RO: Muito Baixo):** aren < 0,5 m/s^2',
        },
        {
          type: DocumentSectionChildrenTypeEnum.TABLE_QUANTITY_VL,
        },
      ],
    },
  ],
};
