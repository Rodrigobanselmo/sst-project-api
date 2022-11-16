import { VariablesPGREnum } from '../enums/variables.enum';
import { PGRSectionChildrenTypeEnum } from '../types/elements.types';
import { IDocumentPGRSectionGroup, PGRSectionTypeEnum } from '../types/section.types';

export const testSection: IDocumentPGRSectionGroup = {
  footer: true,
  header: true,
  data: [
    {
      type: PGRSectionTypeEnum.CHAPTER,
      text: `test`,
    },
    {
      type: PGRSectionTypeEnum.SECTION,
      footerText: `test`,
      children: [
        {
          type: PGRSectionChildrenTypeEnum.HEALTH_EFFECT_TABLES,
        },
      ],
    },
  ],
};
