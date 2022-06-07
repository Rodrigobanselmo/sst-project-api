import { HomogeneousGroup } from '@prisma/client';
import { PageOrientation } from 'docx';
import { RiskFactorGroupDataEntity } from '../../../../../../modules/checklist/entities/riskGroupData.entity';
import { HierarchyEntity } from '../../../../../../modules/company/entities/hierarchy.entity';

import { hierarchyConverter } from './converter/hierarchy.converter';
import { firstRiskInventoryTableSection } from './parts/first/first.table';
import { secondRiskInventoryTableSection } from './parts/second/second.table';
import { thirdRiskInventoryTableSection } from './parts/third/third.table';

export const riskInventoryTableSection = (
  riskFactorGroupData: RiskFactorGroupDataEntity,
  hierarchiesEntity: HierarchyEntity[],
) => {
  const hierarchyData = hierarchyConverter(hierarchiesEntity);

  const sectionsTables = [];

  const map = new Map<string, boolean>();
  // let count = 0;
  hierarchyData.forEach((hierarchy) => {
    //!  REMOVE AFTER TEST

    const homoGroupID = hierarchy.org.find(
      (hierarchy) =>
        hierarchy.homogeneousGroupIds &&
        hierarchy.homogeneousGroupIds.length > 0,
    ).homogeneousGroupIds[0];

    if (map.get(homoGroupID)) {
      return;
    }

    map.set(homoGroupID, true);
    // if (count > 10) return;
    // count++;
    // eslint-disable-next-line prettier/prettier
    //!  REMOVE AFTER TEST

    const firstTable = firstRiskInventoryTableSection(
      riskFactorGroupData,
      hierarchy,
    );
    const secondTable = secondRiskInventoryTableSection(hierarchy);
    const thirdTable = thirdRiskInventoryTableSection(
      riskFactorGroupData,
      hierarchy,
    );

    sectionsTables.push([firstTable, ...secondTable, ...thirdTable]);
  });

  const setSection = (tables: any[]) => ({
    children: [...tables],
    properties: {
      page: {
        margin: { left: 500, right: 500, top: 500, bottom: 500 },
        size: { orientation: PageOrientation.LANDSCAPE },
      },
    },
  });

  return sectionsTables.map((table) => setSection(table));
};
