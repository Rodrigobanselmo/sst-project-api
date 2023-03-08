import { IDocumentModelData } from './../../../types/document-mode.types';
import { IDocumentPGRSectionGroups, IDocVariables } from './../../../docx/builders/pgr/types/section.types';

export const parseModelData = (modelData: IDocumentModelData): IDocumentPGRSectionGroups => {
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
    variables: Object.entries(modelData?.variables || {}).reduce((acc, [key, value]) => ({ ...acc, [key]: value.value }), {} as IDocVariables),
  };

  return sectionGroup;
};
