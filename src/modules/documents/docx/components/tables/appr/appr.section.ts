import { DocumentDataEntity } from './../../../../../sst/entities/documentData.entity';
import { DocumentDataPGRDto } from './../../../../../sst/dto/document-data-pgr.dto';
import { HierarchyEnum } from '@prisma/client';
import { ISectionOptions } from 'docx';
import { sortString } from '../../../../../../shared/utils/sorts/string.sort';
import { RiskFactorGroupDataEntity } from '../../../../../sst/entities/riskGroupData.entity';
import { HierarchyEntity } from '../../../../../company/entities/hierarchy.entity';

import { sectionLandscapeRiskInventoryAnnexProperties } from '../../../base/config/styles';
import { hierarchyConverter, IHierarchyData, IHomoGroupMap } from '../../../converter/hierarchy.converter';
import { riskInventoryAnnexByJobHeadersFooters } from './riskInventoryAnnexSectionFrame';
import { firstRiskInventoryTableSection } from './parts/first/first.table';
import { secondRiskInventoryTableSection } from './parts/second/second.table';
import { thirdRiskInventoryTableSection } from './parts/third/third.table';

export interface IAPPRTableOptions {
  isByGroup?: boolean;
  hierarchyType?: HierarchyEnum;
}

export const APPRTableSection = (
  riskFactorGroupData: RiskFactorGroupDataEntity & DocumentDataEntity & DocumentDataPGRDto,
  hierarchyData: IHierarchyData,
  homoGroupTree: IHomoGroupMap,
  // options: IAPPRTableOptions = {},
): ISectionOptions[] => {
  const sectionsTables = [];
  const isByGroup = false;

  const map = new Map<string, boolean>();

  Array.from(hierarchyData.values())
    .sort((a, b) => sortString(a.org.map((o) => o.name).join(), b.org.map((o) => o.name).join()))
    .forEach((hierarchy) => {
      const createTable = () => {
        const firstTable = firstRiskInventoryTableSection(riskFactorGroupData, homoGroupTree, hierarchy, isByGroup, {
          omitInventoryBannerRow: true,
        });
        const secondTable = secondRiskInventoryTableSection(hierarchy, isByGroup);
        const thirdTable = thirdRiskInventoryTableSection(riskFactorGroupData, hierarchy, isByGroup);

        sectionsTables.push([firstTable, ...secondTable, ...thirdTable]);
      };

      const description = hierarchy.descReal;

      const homoGroupsIds = hierarchy.org.reduce((acc, hierarchy) => {
        if (hierarchy.homogeneousGroupIds) return [...acc, ...hierarchy.homogeneousGroupIds];
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

        if (!description && !homoGroup.type) hierarchy.descReal = homoGroup?.description;
        // if (!homoGroup.type && isByGroup) hierarchy.descReal = homoGroup?.description || hierarchy.descReal || hierarchy.descRh;

        // if (isByGroup) createTable();
      });

      // if (isByGroup) return;

      createTable();
    });

  const setSection = (tables: any[]) => ({
    children: [...tables],
    ...riskInventoryAnnexByJobHeadersFooters(),
    properties: sectionLandscapeRiskInventoryAnnexProperties,
  });

  return sectionsTables.map((table) => setSection(table));
};
