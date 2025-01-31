import { HierarchyEnum } from '@prisma/client';
import { ISectionOptions, PageOrientation, Paragraph, Table } from 'docx';

import { HierarchyMapData, IDocumentRiskGroupDataConverter, IHierarchyData, IHomoGroupMap } from '../../../converter/hierarchy.converter';
import { firstRiskInventoryTableSection } from './parts/first/first.table';
import { secondRiskInventoryTableSection } from './parts/second/second.table';
import { thirdRiskInventoryTableSection } from './parts/third/third.table';
import { sortString } from '@/@v2/shared/utils/sorts/string.sort';
import { asyncBatch } from '@/@v2/shared/utils/helpers/async-batch';
import { simulateAwait } from '@/shared/utils/simulateAwait';
import { arrayChunks } from '@/@v2/shared/utils/helpers/array-chunks';

export interface IAPPRTableOptions {
  isByGroup?: boolean;
  hierarchyType?: HierarchyEnum;
}

async function* processArrayGenerator(data: HierarchyMapData[], processFunction: (item: HierarchyMapData) => void) {
  for (const item of data) {
    yield processFunction(item);
    await new Promise((resolve) => setTimeout(resolve, 10)); // Yield to the event loop
  }
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

  const data = Array.from(hierarchyData.values()).sort((a, b) => sortString(a.org.map((o) => o.name).join(), b.org.map((o) => o.name).join()));

  const createMapFunction = (hierarchy: HierarchyMapData) => {
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
        gho: {
          description: '',
          type: null,
        },
      };

      map.set(homoGroupID, true);

      if (!description && !homoGroup.gho.type) hierarchy.descReal = homoGroup?.gho.description;
      // if (!homoGroup.type && isByGroup) hierarchy.descReal = homoGroup?.description || hierarchy.descReal || hierarchy.descRh;

      // if (isByGroup) createTable();
    });

    createTable();
  };

  processArrayGenerator(data, createMapFunction);

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
