import { VariablesPGREnum } from '../enums/variables.enum';
import { DocumentSectionChildrenTypeEnum } from '../types/elements.types';
import { IDocumentPGRSectionGroup, DocumentSectionTypeEnum } from '../types/section.types';

export const quantityRadSection: IDocumentPGRSectionGroup = {
  data: [
    {
      type: DocumentSectionTypeEnum.SECTION,
      footerText: `??${VariablesPGREnum.CHAPTER_3}??`,
      removeWithSomeEmptyVars: [VariablesPGREnum.HAS_QUANTITY_RAD],
      children: [
        {
          type: DocumentSectionChildrenTypeEnum.H2,
          text: 'Resultados Avaliações Agente Físico – Radiações Ionizantes',
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: 'A seguir são apresentados os resultados quantitativos de exposição a Radiações Ionizantes, Conforme explicitado no ‘item’ 6.4 do Documento Base os critérios de aceitabilidade para o RO de Radiações Ionizantes:',
        },
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH_TABLE,
          text: 'Resultados Avaliações Agente Físico – Radiações Ionizantes',
        },
        {
          type: DocumentSectionChildrenTypeEnum.TABLE_QUANTITY_RAD,
        },
      ],
    },
  ],
};
