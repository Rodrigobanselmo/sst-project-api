import { ISectionChildrenType } from "./elements.types";
import { IAllDocumentSectionType } from "./section.types";

export type IDocumentModelVariables = {
  label: string;
  type: string;
}[]

export type IDocumentModelSectionGroup = {
  data: (Omit<IAllDocumentSectionType, 'children'> & { id: string })[];
  children?: Record<string, ISectionChildrenType[]>;
  label?: string;
};

export type IDocumentModelData = {
  variables: IDocumentModelVariables;
  sections: IDocumentModelSectionGroup[];
};

