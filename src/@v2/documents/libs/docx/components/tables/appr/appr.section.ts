import { arrayChunks } from '@/@v2/shared/utils/helpers/array-chunks';
import { HierarchyEnum } from '@prisma/client';
import { ISectionOptions, PageOrientation, Paragraph, Table } from 'docx';

import { sortString } from '@/@v2/shared/utils/sorts/string.sort';
import { HierarchyMapData, IDocumentRiskGroupDataConverter, IHierarchyData, IHomoGroupMap } from '../../../converter/hierarchy.converter';
import { epiRiskInventoryTableSection } from './parts/epi/epi.table';
import { firstRiskInventoryTableSection } from './parts/first/first.table';
import { secondRiskInventoryTableSection } from './parts/second/second.table';
import { thirdRiskInventoryTableSection } from './parts/third/third.table';
import { asyncBatch } from '@/@v2/shared/utils/helpers/async-batch';
import { simulateAwait } from '../../../helpers/simulate-await';

export interface IAPPRTableOptions {
  isHideCA: boolean;
  hierarchyType?: HierarchyEnum;
  isHideOrigin: boolean;
}

export const APPRTableSection = async (
  riskFactorGroupData: IDocumentRiskGroupDataConverter,
  hierarchyData: IHierarchyData,
  homoGroupTree: IHomoGroupMap,
  options: IAPPRTableOptions,
): Promise<ISectionOptions[]> => {
  const sectionsTables = [] as (Table | Paragraph)[][];
  const isByGroup = false;

  const map = new Map<string, boolean>();

  const data = Array.from(hierarchyData.values()).sort((a, b) => sortString(a.org.map((o) => o.name).join(), b.org.map((o) => o.name).join()));

  const createMapFunction = async (hierarchy: HierarchyMapData) => {
    const createTable = () => {
      const epis = hierarchy.allHomogeneousGroupIds
        .map((id) => {
          return homoGroupTree[id].gho.risksData({ documentType: 'isPGR' }).map((risk) => risk.epis.map((epi) => epi).flat());
        })
        .flat(2);

      const episDeduplicated = epis.filter((epi, index, self) => index === self.findIndex((t) => t.ca === epi.ca));

      const firstTable = firstRiskInventoryTableSection(riskFactorGroupData, homoGroupTree, hierarchy, isByGroup);
      const secondTable = secondRiskInventoryTableSection(hierarchy, isByGroup);
      const epiTable = epiRiskInventoryTableSection(episDeduplicated, options.isHideCA);
      const thirdTable = thirdRiskInventoryTableSection(riskFactorGroupData, hierarchy, isByGroup, options);

      sectionsTables.push([firstTable, ...secondTable, ...epiTable, ...thirdTable]);
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
    await simulateAwait(200);
  };

  await asyncBatch({
    items: data,
    batchSize: 10,
    callback: createMapFunction,
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
