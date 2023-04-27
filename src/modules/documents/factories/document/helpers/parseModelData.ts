import { IDocumentModelData } from './../../../types/document-mode.types';
import { IDocumentPGRSectionGroups, IDocVariables } from './../../../docx/builders/pgr/types/section.types';

export const parseModelData = (modelData: IDocumentModelData): IDocumentPGRSectionGroups => {
  let docVariables = modelData?.variables as any;
  if (Array.isArray(docVariables)) {
    docVariables = docVariables.reduce((acc, item) => ({ ...acc, [item.type]: item.label }), {} as IDocVariables);
  }

  const sectionGroup: IDocumentPGRSectionGroups = {
    sections: modelData?.sections?.map(({ children: sectionChildren, ...section }) => {
      return {
        data: section.data.map((sectionItem) => {
          const sectionId = sectionItem.id;
          const children = sectionChildren?.[sectionId];

          return { ...sectionItem, ...(children && { children }) };
        }),
      };
    }),
    variables: docVariables,
  };

  return sectionGroup;
};
