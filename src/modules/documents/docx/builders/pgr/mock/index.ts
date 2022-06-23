import { VariablesPGREnum } from '../enums/variables.enum';
import { IDocumentPGRSectionGroups } from '../types/section.types';
import { initSection } from './1.0-init';
import { definitionsSection } from './1.1-definitions';
import { environmentSection } from './2.0-envronment';

export const docPGRSections: IDocumentPGRSectionGroups = {
  sections: [initSection, definitionsSection, environmentSection],
  variables: {
    [VariablesPGREnum.CHAPTER_1]: 'PARTE 01 – DOCUMENTO BASE',
    [VariablesPGREnum.CHAPTER_2]: 'PARTE 02 – DESENVOLVIMENTO',
  },
};
