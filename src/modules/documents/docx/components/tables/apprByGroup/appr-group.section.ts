import { HierarchyEnum, HomoTypeEnum } from '@prisma/client';
import { ISectionOptions, PageOrientation } from 'docx';

import { originRiskMap } from '../../../../../../shared/constants/maps/origin-risk';
import { RiskFactorGroupDataEntity } from '../../../../../checklist/entities/riskGroupData.entity';
import { HomoGroupEntity } from '../../../../../company/entities/homoGroup.entity';
import {
  HierarchyMapData,
  IHierarchyData,
  IHierarchyMap,
  IHomoGroupMap,
} from '../../../converter/hierarchy.converter';
import { firstRiskInventoryTableSection } from './parts/first/first.table';
import { secondRiskInventoryTableSection } from './parts/second/second.table';
import { thirdRiskInventoryTableSection } from './parts/third/third.table';

export interface IAPPRTableOptions {
  isByGroup?: boolean;
}

export const APPRByGroupTableSection = (
  riskFactorGroupData: RiskFactorGroupDataEntity,
  hierarchyData: IHierarchyData,
  hierarchyTree: IHierarchyMap,
  homoGroupTree: IHomoGroupMap,
  options: IAPPRTableOptions = {
    isByGroup: true,
  },
): ISectionOptions[] => {
  const sectionsTables = [];
  const isByGroup = options.isByGroup;
  let workspace = '';

  hierarchyData.forEach((hierarchy) => {
    if (workspace) return;
    if (hierarchy.workspace) workspace = hierarchy.workspace;
  });

  const homoTree: IHomoGroupMap = { ...homoGroupTree };
  const hierarchyDataHomoGroup = new Map<string, HierarchyMapData>();

  const map = new Map<string, boolean>();

  const everyHomoFound = [] as string[];
  const everyHomoNotFound = [] as string[];

  const setHomoGroup = (homo: HomoGroupEntity) => {
    let nameOrigin: string;
    let desc: string;
    let descRh: string;
    let typeOrigin: string;
    // let environments: string;

    if (homo.environment) {
      typeOrigin = originRiskMap[homo.environment.type].name;
      desc = homo.environment.description;
      nameOrigin = homo.environment.name;
    }

    if (homo.characterization) {
      typeOrigin = originRiskMap[homo.characterization.type].name;
      desc = homo.characterization.description;
      nameOrigin = homo.characterization.name;
    }

    if (homo.type == HomoTypeEnum.HIERARCHY) {
      const hierarchy = hierarchyTree[homo.id] || hierarchyTree[homo.name];

      if (hierarchy) {
        typeOrigin = originRiskMap[hierarchy.type].name;
        nameOrigin = `${hierarchy.name}`;
        desc = hierarchy.realDescription;
        descRh = hierarchy.description;
      }
    }

    if (!homo.type) {
      typeOrigin = 'GSE';
      desc = homo.description;
      nameOrigin = homo.name;
    }

    hierarchyDataHomoGroup.set(homo.id, {
      allHomogeneousGroupIds: [homo.id],
      descReal: desc,
      descRh: descRh || desc,
      employeesLength: homo.employeeCount,
      org: [
        {
          id: homo.id,
          name: nameOrigin,
          homogeneousGroup: nameOrigin,
          environments: '',
          homogeneousGroupIds: [homo.id],
          type: '',
          typeEnum:
            homo.type === HomoTypeEnum.HIERARCHY
              ? hierarchyTree[homo.name].type
              : ('' as any),
        },
      ],
      workspace,
      type: typeOrigin,
    } as any);
  };

  Object.values(homoTree).forEach((homo) => {
    if (homo.type) return;

    const foundHomo = hierarchyDataHomoGroup.get(homo.id);

    if (!foundHomo) setHomoGroup(homo);

    homoTree[homo.id].hierarchies.forEach((hierarchy, i, hierarchies) => {
      hierarchy.homogeneousGroups.forEach((homoGroup) => {
        const isOnEvery = hierarchies.every((hierarchyEvery) =>
          hierarchyEvery.homogeneousGroups.find((h) => h.id === homoGroup.id),
        );

        const mapDataHomo = hierarchyDataHomoGroup.get(homo.id);
        const isHomoAdded = mapDataHomo.allHomogeneousGroupIds.find(
          (homoId) => homoId === homoGroup.id,
        );
        if (isOnEvery && !isHomoAdded) {
          everyHomoFound.push(homoGroup.id);

          hierarchyDataHomoGroup.set(homo.id, {
            ...mapDataHomo,
            allHomogeneousGroupIds: [
              ...mapDataHomo.allHomogeneousGroupIds,
              homoGroup.id,
            ],
          });
        }
        if (!isOnEvery) {
          everyHomoNotFound.push(homoGroup.id);
        }
      });
    });
  });

  // Object.values(homoGroupTree).forEach((homo) => {
  //   const hasFound = everyHomoFound.includes(homo.id);
  //   if (!hasFound) {
  //     setHomoGroup(homo);
  //   }
  // });

  hierarchyDataHomoGroup.forEach((hierarchy) => {
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
        hierarchyTree,
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
