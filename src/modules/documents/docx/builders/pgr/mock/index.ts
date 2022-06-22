import { VariablesPGREnum } from '../enums/variables.enum';
import { IDocumentPGRSectionGroups } from '../types/section.types';
import { initSection } from './0-init';

export const docPGRSections: IDocumentPGRSectionGroups = {
  sections: [initSection],
  variables: {
    [VariablesPGREnum.CHAPTER_1]: 'PARTE 01 – DOCUMENTO BASE',
    [VariablesPGREnum.CHAPTER_2]: 'PARTE 02 – DESENVOLVIMENTO',
  },
};
