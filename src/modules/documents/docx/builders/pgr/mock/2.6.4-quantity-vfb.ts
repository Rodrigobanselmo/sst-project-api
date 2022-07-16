import { VariablesPGREnum } from '../enums/variables.enum';
import { PGRSectionChildrenTypeEnum } from '../types/elements.types';
import {
  IDocumentPGRSectionGroup,
  PGRSectionTypeEnum,
} from '../types/section.types';

export const quantityVFBSection: IDocumentPGRSectionGroup = {
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
          text: 'Resultados Avaliações Agente Físico – Vibração de Corpo Inteiro',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'A seguir são apresentados os resultados quantitativos de exposição a Vibração de Corpo Inteiro.',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Conforme explicitado no ‘item’ 6.4 do Documento Base os critérios de aceitabilidade para o RO de Vibração de Corpo Inteiro são:',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: '**Inaceitável (RO: Muito Alto):** aren Acima de 1,1 m/s^2 e VDVR Acima de 21 m/s^1,75',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: '**Temporariamente Aceitável (RO: Alto):** aren 0,9 m/s^2 a 1,1 m/s^2 e VDVR 16,4 a 21 m/s^1,75',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: '**Aceitável (RO: Moderado):** aren > 0,5 m/s^2 a < 0,9 m/s^2 e VDVR > 9,1 a < 16,4 m/s^1,75',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: '**Aceitável (RO: Baixo):** aren 0,1 m/s^2 a 0,5 m/s^2 e VDVR 2,1 a 9,1 m/s^1,75',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: '**Aceitável (RO: Baixo):** aren < 0,1 m/s^2 e VDVR < 2,1 m/s^1,755',
        },
        {
          type: PGRSectionChildrenTypeEnum.TABLE_QUANTITY_VFB,
        },
      ],
    },
  ],
};