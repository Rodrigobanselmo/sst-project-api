import { PageOrientation } from 'docx';

import { IDocumentRiskGroupDataConverter, IHierarchyMap } from '../../../../converter/hierarchy.converter';
import { quantityVFBTable } from './quantityVFB.table';

export const quantityVFBTableSection = (riskGroupData: IDocumentRiskGroupDataConverter, hierarchyTree: IHierarchyMap) => {
  const table = quantityVFBTable(riskGroupData, hierarchyTree);

  const section = {
    children: [table],
    properties: {
      page: {
        margin: { left: 500, right: 500, top: 500, bottom: 500 },
        size: { orientation: PageOrientation.LANDSCAPE },
      },
    },
  };

  return section;
};
