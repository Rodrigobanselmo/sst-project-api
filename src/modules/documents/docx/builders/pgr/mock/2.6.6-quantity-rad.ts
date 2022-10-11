import { VariablesPGREnum } from '../enums/variables.enum';
import { PGRSectionChildrenTypeEnum } from '../types/elements.types';
import {
  IDocumentPGRSectionGroup,
  PGRSectionTypeEnum,
} from '../types/section.types';

export const quantityRadSection: IDocumentPGRSectionGroup = {
  footer: true,
  header: true,
  data: [
    {
      type: PGRSectionTypeEnum.SECTION,
      footerText: `??${VariablesPGREnum.CHAPTER_3}??`,
      removeWithSomeEmptyVars: [VariablesPGREnum.HAS_QUANTITY_RAD],
      children: [
        {
          type: PGRSectionChildrenTypeEnum.H2,
          text: 'Resultados Avaliações Agente Físico – Radiações Ionizantes',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'A seguir são apresentados os resultados quantitativos de exposição a Radiações Ionizantes, Conforme explicitado no ‘item’ 6.4 do Documento Base os critérios de aceitabilidade para o RO de Radiações Ionizantes:',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH_TABLE,
          text: 'Resultados Avaliações Agente Físico – Radiações Ionizantes',
        },
        {
          type: PGRSectionChildrenTypeEnum.TABLE_QUANTITY_RAD,
        },
      ],
    },
  ],
};
