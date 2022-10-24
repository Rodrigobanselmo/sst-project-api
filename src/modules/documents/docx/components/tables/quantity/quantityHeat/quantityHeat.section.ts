import { PageOrientation } from 'docx';

import { RiskFactorGroupDataEntity } from '../../../../../../sst/entities/riskGroupData.entity';
import { IHierarchyMap } from '../../../../converter/hierarchy.converter';
import { quantityHeatTable } from './quantityHeat.table';

export const quantityHeatTableSection = (
  riskGroupData: RiskFactorGroupDataEntity,
  hierarchyTree: IHierarchyMap,
) => {
  const table = quantityHeatTable(riskGroupData, hierarchyTree);

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
