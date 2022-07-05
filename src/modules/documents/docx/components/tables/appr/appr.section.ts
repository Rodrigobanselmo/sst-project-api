import { HierarchyEnum, HomogeneousGroup } from '@prisma/client';
import { ISectionOptions, PageOrientation } from 'docx';
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
    isByGroup: false,
  },
): ISectionOptions[] => {
  const sectionsTables = [];
  const isByGroup = options.isByGroup;

  const map = new Map<string, boolean>();

  hierarchyData.forEach((hierarchy) => {
    const createTable = () => {
      const firstTable = firstRiskInventoryTableSection(
        riskFactorGroupData,
        homoGroupTree,
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

    const description = hierarchy.descReal;

    const homoGroupsIds = hierarchy.org.reduce((acc, hierarchy) => {
      if (hierarchy.homogeneousGroupIds)
        return [...acc, ...hierarchy.homogeneousGroupIds];
      return acc;
    }, []);

    homoGroupsIds.forEach((homoGroupID) => {
      if (map.get(homoGroupID)) {
        return;
      }

      const homoGroup = homoGroupTree[homoGroupID] || {
        description: '',
        type: null,
      };

      map.set(homoGroupID, true);

      // eslint-disable-next-line prettier/prettier
      if (!description && !homoGroup.type)  hierarchy.descReal = homoGroup?.description;
      if (!homoGroup.type && isByGroup)
        hierarchy.descReal =
          homoGroup?.description || hierarchy.descReal || hierarchy.descRh;

      if (isByGroup) createTable();
    });

    if (isByGroup) return;

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
