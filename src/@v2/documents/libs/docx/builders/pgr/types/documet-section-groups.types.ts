import { IAllDocumentSectionType } from '../../../../../domain/types/section.types';

export type IDocumentSectionGroup = {
  data: IAllDocumentSectionType[];
};

export type IDocVariables = Record<string, string>;

export type IDocumentSectionGroups = {
  variables: IDocVariables;
  sections: IDocumentSectionGroup[];
};
