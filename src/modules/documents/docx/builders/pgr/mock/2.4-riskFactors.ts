import { sectionLandscapeProperties } from '../../../base/config/styles';
import { VariablesPGREnum } from '../enums/variables.enum';
import { PGRSectionChildrenTypeEnum } from '../types/elements.types';
import {
  IDocumentPGRSectionGroup,
  PGRSectionTypeEnum,
} from '../types/section.types';

export const riskFactors3Section: IDocumentPGRSectionGroup = {
  footer: true,
  header: true,
  data: [
    {
      properties: sectionLandscapeProperties,
      type: PGRSectionTypeEnum.SECTION,
      footerText: `??${VariablesPGREnum.CHAPTER_2}??`,
      children: [
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH_TABLE,
          text: 'Caracterização dos Fatores de Risco e Perigos',
        },
        {
          type: PGRSectionChildrenTypeEnum.RISK_TABLE,
        },
        {
          type: PGRSectionChildrenTypeEnum.LEGEND,
          text: '**CAS**: Chemical Abstract Service | | **PV**: Pressão de Vapor | **BEI**: Índices Biológicos de Exposição | **Carc**: Carcinogenicidade | **PE**: Ponto de Ebulição | **GES**: Grau de Efeito à Saúde (Severidade) | **NE**: Não Estabelecido | **ND**: Não Determinado',
        },
      ],
    },
  ],
};
