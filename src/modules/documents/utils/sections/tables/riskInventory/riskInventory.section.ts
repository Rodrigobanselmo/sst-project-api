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
  hierarchyData.forEach((hierarchy, key) => {
    //!  REMOVE AFTER TEST

    if (key == '478287bf-855e-4308-b50f-29b77ee0ef3c') console.log(hierarchy);

    const homoGroupsIds = hierarchy.org.reduce((acc, hierarchy) => {
      if (hierarchy.homogeneousGroupIds)
        return [...acc, ...hierarchy.homogeneousGroupIds];
    }, []);

    homoGroupsIds.forEach((homoGroupID) => {
      if (map.get(homoGroupID)) {
        return;
      }

      map.set(homoGroupID, true);

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
    // if (count > 10) return;
    // count++;
    // eslint-disable-next-line prettier/prettier
    // will return to stop to continue with hierarchy code
    return;
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
