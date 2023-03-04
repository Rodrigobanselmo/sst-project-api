import { ISectionChildrenType } from '../docx/builders/pgr/types/elements.types';
import { IAllDocumentSectionType, IDocVariables } from '../docx/builders/pgr/types/section.types';

export type IDocumentModelVariables = Record<
  string,
  {
    label: string;
    value?: string;
    type: string;
  }
>;

export type IDocumentModelSectionGroup = {
  data: IAllDocumentSectionType[];
  label?: string;
  children?: Record<string, ISectionChildrenType[]>;
};

export type IDocumentModelData = {
  variables: IDocVariables;
  sections: IDocumentModelSectionGroup[];
};
