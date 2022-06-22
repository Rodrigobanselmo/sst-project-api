import { HierarchyEnum, HomogeneousGroup } from '@prisma/client';
import { PageOrientation } from 'docx';
import { RiskFactorGroupDataEntity } from '../../../../../checklist/entities/riskGroupData.entity';
import { HierarchyEntity } from '../../../../../company/entities/hierarchy.entity';

import {
  hierarchyConverter,
  IHierarchyData,
  IHomoGroupMap,
} from '../../../converter/hierarchy.converter';
import { firstRiskInventoryTableSection } from './parts/first/first.table';
import { secondRiskInventoryTableSection } from './parts/second/second.table';
import { thirdRiskInventoryTableSection } from './parts/third/third.table';

export interface IAPPRTableOptions {
  isByGroup?: boolean;
  hierarchyType?: HierarchyEnum;
}

export const APPRTableSection = (
  riskFactorGroupData: RiskFactorGroupDataEntity,
  hierarchyData: IHierarchyData,
  homoGroupTree: IHomoGroupMap,
  options: IAPPRTableOptions = {
    hierarchyType: HierarchyEnum.SECTOR,
    isByGroup: true,
  },
) => {
  const sectionsTables = [];
  const isByGroup = options.isByGroup;

  const map = new Map<string, boolean>();

  hierarchyData.forEach((hierarchy) => {
    const createTable = () => {
      const firstTable = firstRiskInventoryTableSection(
        riskFactorGroupData,
        hierarchy,
        isByGroup,
      );
      const secondTable = secondRiskInventoryTableSection(hierarchy, isByGroup);
      const thirdTable = thirdRiskInventoryTableSection(
        riskFactorGroupData,
        hierarchy,
      );

      sectionsTables.push([firstTable, ...secondTable, ...thirdTable]);
    };

    if (isByGroup) {
      const homoGroupsIds = hierarchy.org.reduce((acc, hierarchy) => {
        if (hierarchy.homogeneousGroupIds)
          return [...acc, ...hierarchy.homogeneousGroupIds];
      }, []);

      homoGroupsIds.forEach((homoGroupID) => {
        if (map.get(homoGroupID)) {
          return;
        }

        const homoGroup = homoGroupTree[homoGroupID] || { description: '' };

        map.set(homoGroupID, true);

        hierarchy.descReal =
          homoGroup?.description || hierarchy.descReal || hierarchy.descRh; //!remove  hierarchy.descReal || hierarchy.descRh only for ramon

        createTable();
      });

      return;
    }

    createTable();
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
