import { HierarchyEnum } from '@prisma/client';
import { PageOrientation } from 'docx';

import { RiskFactorGroupDataEntity } from '../../../../../sst/entities/riskGroupData.entity';
import { IHierarchyData, IHierarchyMap } from '../../../converter/hierarchy.converter';
import { IHierarchyPrioritizationOptions } from './hierarchyPrioritization.converter';
import { hierarchyPrioritizationTables } from './hierarchyPrioritization.tables';

export const hierarchyPrioritizationTableSections = (
  riskFactorGroupData: RiskFactorGroupDataEntity,
  hierarchiesEntity: IHierarchyData,
  hierarchyTree: IHierarchyMap,
  options: IHierarchyPrioritizationOptions = {
    hierarchyType: HierarchyEnum.OFFICE,
    isByGroup: false,
  },
) => {
  const tables = hierarchyPrioritizationTables(riskFactorGroupData, hierarchiesEntity, hierarchyTree, options);

  const sections = tables.map((table) => ({
    children: [table],
    properties: {
      page: {
        margin: { left: 500, right: 500, top: 500, bottom: 500 },
        size: { orientation: PageOrientation.LANDSCAPE },
      },
    },
  }));

  return sections;
};
