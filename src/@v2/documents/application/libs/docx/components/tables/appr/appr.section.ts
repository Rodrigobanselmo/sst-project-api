import { HierarchyEnum } from '@prisma/client';
import { ISectionOptions, PageOrientation, Paragraph, Table } from 'docx';

import { IDocumentRiskGroupDataConverter, IHierarchyData, IHomoGroupMap } from '../../../converter/hierarchy.converter';
import { firstRiskInventoryTableSection } from './parts/first/first.table';
import { secondRiskInventoryTableSection } from './parts/second/second.table';
import { thirdRiskInventoryTableSection } from './parts/third/third.table';
import { sortString } from '@/@v2/shared/utils/sorts/string.sort';

export interface IAPPRTableOptions {
  isByGroup?: boolean;
  hierarchyType?: HierarchyEnum;
}

export const APPRTableSection = (
  riskFactorGroupData: IDocumentRiskGroupDataConverter,
  hierarchyData: IHierarchyData,
  homoGroupTree: IHomoGroupMap,
  // options: IAPPRTableOptions = {},
): ISectionOptions[] => {
  const sectionsTables = [] as (Table | Paragraph)[][];
  const isByGroup = false;

  const map = new Map<string, boolean>();

  Array.from(hierarchyData.values())
    .sort((a, b) => sortString(a.org.map((o) => o.name).join(), b.org.map((o) => o.name).join()))
    .forEach((hierarchy) => {
      const createTable = () => {
        const firstTable = firstRiskInventoryTableSection(riskFactorGroupData, homoGroupTree, hierarchy, isByGroup);
        const secondTable = secondRiskInventoryTableSection(hierarchy, isByGroup);
        const thirdTable = thirdRiskInventoryTableSection(riskFactorGroupData, hierarchy, isByGroup);

        sectionsTables.push([firstTable, ...secondTable, ...thirdTable]);
      };

      const description = hierarchy.descReal;

      const homoGroupsIds = hierarchy.org.reduce((acc, hierarchy) => {
        if (hierarchy.homogeneousGroupIds) return [...acc, ...hierarchy.homogeneousGroupIds];
        return acc;
      }, [] as string[]);

      homoGroupsIds.forEach((homoGroupID) => {
        if (map.get(homoGroupID)) {
          return;
        }

        const homoGroup = homoGroupTree[homoGroupID] || {
          description: '',
          type: null,
        };

        map.set(homoGroupID, true);

        if (!description && !homoGroup.gho.type) hierarchy.descReal = homoGroup?.gho.description;
        // if (!homoGroup.type && isByGroup) hierarchy.descReal = homoGroup?.description || hierarchy.descReal || hierarchy.descRh;

        // if (isByGroup) createTable();
      });

      // if (isByGroup) return;

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
