import { IDocumentModelData } from "@/@v2/documents/domain/types/document-mode-data.types";
import { IDocumentSectionGroup, IDocumentSectionGroups, IDocVariables } from "../types/documet-section-groups.types";
import { ISectionChildrenType } from "@/@v2/documents/domain/types/elements.types";

export const parseModelData = (model: IDocumentModelData): IDocumentSectionGroups => {
  const docVariables: IDocVariables = model.variables.reduce((acc, item) => ({ ...acc, [item.type]: item.label }), {} as IDocVariables);

  const sections = model.sections.map<IDocumentSectionGroup>(({ children: childrenMap, data }) => {
    return {
      data: data.map((sectionItem) => {
        const sectionId = sectionItem.id;
        const children = childrenMap?.[sectionId] as ISectionChildrenType[];

        return { ...sectionItem, children };
      }),
    };
  })

  const sectionGroup: IDocumentSectionGroups = {
    sections: sections,
    variables: docVariables,
  };

  return sectionGroup;
};
