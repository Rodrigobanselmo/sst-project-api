import { sectionLandscapeProperties } from '../../../base/config/styles';
import { VariablesPGREnum } from '../enums/variables.enum';
import { DocumentSectionChildrenTypeEnum } from '@/@v2/documents/domain/types/DocumentSectionChildrenTypeEnum';
import { IDocumentPGRSectionGroup } from '../../../../../../domain/types/section.types';
import { DocumentSectionTypeEnum } from '@/@v2/documents/domain/enums/document-section-type.enum';

export const riskFactors3Section: IDocumentPGRSectionGroup = {
  data: [
    {
      properties: sectionLandscapeProperties,
      type: DocumentSectionTypeEnum.SECTION,
      footerText: `??${VariablesPGREnum.CHAPTER_2}??`,
      children: [
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH_TABLE,
          text: 'Caracterização dos Fatores de Risco e Perigos',
        },
        {
          type: DocumentSectionChildrenTypeEnum.RISK_TABLE,
        },
        {
          type: DocumentSectionChildrenTypeEnum.LEGEND,
          text: '**CAS**: Chemical Abstract Service | | **PV**: Pressão de Vapor | **BEI**: Índices Biológicos de Exposição | **Carc**: Carcinogenicidade | **PE**: Ponto de Ebulição | **GES**: Grau de Efeito à Saúde (Severidade) | **NE**: Não Estabelecido | **ND**: Não Determinado',
        },
      ],
    },
  ],
};