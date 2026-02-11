import { Paragraph, Table } from 'docx';

import { DocumentPGRModel } from '@/@v2/documents/domain/models/document-pgr.model';
import { ISectionChildrenType } from '../../../../../domain/types/elements.types';
import { IHierarchyData, IHomoGroupMap, IHierarchyMap } from '../../../converter/hierarchy.converter';
import { activitiesInsalubridadeSections } from './activities-insalubridade.sections';

export const activitiesInsalubridadeElements = (
  document: DocumentPGRModel,
  hierarchiesTreeOrg: IHierarchyData,
  homoGroupTree: IHomoGroupMap,
  hierarchyTree: IHierarchyMap,
  convertToDocx: (data: ISectionChildrenType[]) => (Paragraph | Table)[],
): (Paragraph | Table)[] => {
  const sections = activitiesInsalubridadeSections(document, hierarchiesTreeOrg, homoGroupTree, hierarchyTree, convertToDocx);

  // Flatten all children from all sections into a single array
  return sections.reduce<(Paragraph | Table)[]>((acc, section) => {
    return [...acc, ...section.children];
  }, []);
};


