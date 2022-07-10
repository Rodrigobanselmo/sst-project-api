import { sectionLandscapeProperties } from '../../../base/config/styles';
import { VariablesPGREnum } from '../enums/variables.enum';
import { PGRSectionChildrenTypeEnum } from '../types/elements.types';
import {
  IDocumentPGRSectionGroup,
  PGRSectionTypeEnum,
} from '../types/section.types';

export const endSection: IDocumentPGRSectionGroup = {
  footer: true,
  header: true,
  data: [
    {
      properties: sectionLandscapeProperties,
      type: PGRSectionTypeEnum.SECTION,
      footerText: `??${VariablesPGREnum.CHAPTER_3}??`,
      children: [
        {
          type: PGRSectionChildrenTypeEnum.H1,
          text: 'ENCERRAMENTO',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Este trabalho tem a validade legal para as condições analisadas, onde quaisquer alterações que venham a ocorrer no âmbito da distribuição física ao processo de trabalho da empresa, tornarão este Programa sem validade, isentando o profissional de qualquer responsabilidade. Neste caso, haverá necessidade de realizar-se novo estudo e um novo documento.',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Na certeza de que, através de o referido trabalho tenha atendido aos objetivos de um PGR de que fora incumbido, submeto este à apreciação de quem possa interessar.',
        },
      ],
    },
  ],
};
