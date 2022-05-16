import { PageOrientation } from 'docx';
import { RiskFactorGroupDataEntity } from 'src/modules/checklist/entities/riskGroupData.entity';
import { HierarchyEntity } from 'src/modules/company/entities/hierarchy.entity';

import { hierarchyConverter } from './converter/hierarchy.converter';
import { firstRiskInventoryTableSection } from './parts/first/first.table';
import { secondRiskInventoryTableSection } from './parts/second/second.table';
import { thirdRiskInventoryTableSection } from './parts/third/third.table';

export const riskInventoryTableSection = (
  riskFactorGroupData: RiskFactorGroupDataEntity,
  hierarchiesEntity: HierarchyEntity[],
) => {
  const hierarchyData = hierarchyConverter(hierarchiesEntity);

  // hierarchyData.forEach((data) => console.log(data.org));

  const sectionsTables = [];
  hierarchyData.forEach((hierarchy) => {
    // eslint-disable-next-line prettier/prettier
    const firstTable = firstRiskInventoryTableSection(riskFactorGroupData, hierarchy);
    const secondTable = secondRiskInventoryTableSection(hierarchy);
    const thirdTable = thirdRiskInventoryTableSection(riskFactorGroupData);

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
