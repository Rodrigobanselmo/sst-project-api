import { DocumentDataEntity } from './../../../../../sst/entities/documentData.entity';
import { DocumentDataPGRDto } from './../../../../../sst/dto/document-data-pgr.dto';
import { HierarchyEntity } from './../../../../../company/entities/hierarchy.entity';
import { HomoTypeEnum } from '@prisma/client';
import { ISectionOptions, PageOrientation } from 'docx';
import { removeDuplicate } from '../../../../../../shared/utils/removeDuplicate';

import { originRiskMap } from '../../../../../../shared/constants/maps/origin-risk';
import { RiskFactorGroupDataEntity } from '../../../../../sst/entities/riskGroupData.entity';
import { HomoGroupEntity } from '../../../../../company/entities/homoGroup.entity';
import { HierarchyMapData, IHierarchyData, IHierarchyMap, IHomoGroupMap } from '../../../converter/hierarchy.converter';
import { firstRiskInventoryTableSection } from './parts/first/first.table';
import { secondRiskInventoryTableSection } from './parts/second/second.table';
import { thirdRiskInventoryTableSection } from './parts/third/third.table';
import { officeRiskInventoryTableSection } from './parts/2-offices/offices.table';
import { sortString } from '../../../../../../shared/utils/sorts/string.sort';

export interface IAPPRTableOptions {
  isByGroup?: boolean;
}

export const APPRByGroupTableSection = (
  riskFactorGroupData: RiskFactorGroupDataEntity & DocumentDataEntity & DocumentDataPGRDto,
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

  const hierarchyDataHomoGroup = new Map<string, HierarchyMapData & { hierarchies: HierarchyEntity[] }>();

  const everyHomoFound = [] as string[];
  const everyHomoNotFound = [] as string[];

  const setHomoGroup = (homo: HomoGroupEntity) => {
    const { desc, descRh, nameOrigin, typeOrigin } = getHomoGroupName(homo, hierarchyTree);

    hierarchyDataHomoGroup.set(homo.id, {
      hierarchies: homoGroupTree[homo.id].hierarchies,
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
          typeEnum: homo.type === HomoTypeEnum.HIERARCHY ? hierarchyTree[homo.name].type : ('' as any),
        },
      ],
      workspace,
      type: typeOrigin,
    } as any);
  };

  Object.values(homoGroupTree)
    .sort((a, b) => sortString(a.name, b.name))
    .forEach((homo) => {
      if (homo.type) return;

      const foundHomo = hierarchyDataHomoGroup.get(homo.id);

      if (!foundHomo) setHomoGroup(homo);
      everyHomoFound.push(homo.id);

      homoGroupTree[homo.id].hierarchies.forEach((hierarchy, i, hierarchies) => {
        const allHomogeneousGroupIds = (hierarchyData.get(hierarchy.id) || { allHomogeneousGroupIds: [] })
          ?.allHomogeneousGroupIds;

        removeDuplicate([...allHomogeneousGroupIds.map((id) => ({ id })), ...hierarchy.homogeneousGroups], {
          removeById: 'id',
        }).forEach((homoGroup) => {
          const isOnEvery = hierarchies.every((hierarchyEvery) => {
            const everyAllHomogeneousGroupIds = (
              hierarchyData.get(hierarchyEvery.id) || {
                allHomogeneousGroupIds: [],
              }
            )?.allHomogeneousGroupIds;

            return [...everyAllHomogeneousGroupIds.map((id) => ({ id })), ...hierarchyEvery.homogeneousGroups].find(
              (h) => h.id === homoGroup.id,
            );
          });

          const mapDataHomo = hierarchyDataHomoGroup.get(homo.id);
          const isHomoAdded = mapDataHomo.allHomogeneousGroupIds.find((homoId) => homoId === homoGroup.id);

          if (isOnEvery && !isHomoAdded) {
            everyHomoFound.push(homoGroup.id);
            const allHomogeneousGroupIds = [...mapDataHomo.allHomogeneousGroupIds, homoGroup.id];

            hierarchyDataHomoGroup.set(homo.id, {
              ...mapDataHomo,
              allHomogeneousGroupIds,
              hierarchies: homoGroupTree[homo.id].hierarchies,
            });
          }

          if (!isOnEvery) {
            everyHomoNotFound.push(homoGroup.id);
          }
        });
      });
    });

  Object.values(homoGroupTree).forEach((homo) => {
    const hasFound = everyHomoFound.includes(homo.id);
    // const isNotOnEvery = everyHomoNotFound.includes(homo.id);
    if (!hasFound) {
      setHomoGroup(homo);
    }
  });

  hierarchyDataHomoGroup.forEach((hierarchy) => {
    const createTable = () => {
      const firstTable = firstRiskInventoryTableSection(riskFactorGroupData, homoGroupTree, hierarchy, isByGroup);
      const officeTable = officeRiskInventoryTableSection(hierarchy);
      const secondTable = secondRiskInventoryTableSection(hierarchy, isByGroup);
      const thirdTable = thirdRiskInventoryTableSection(riskFactorGroupData, hierarchy, hierarchyTree);

      sectionsTables.push([firstTable, ...officeTable, ...secondTable, ...thirdTable]);
    };
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

export const getHomoGroupName = (homo: HomoGroupEntity, hierarchyTree?: IHierarchyMap) => {
  let nameOrigin: string;
  let desc: string;
  let descRh: string;
  let typeOrigin: string;

  if (homo.environment) {
    typeOrigin = 'GSE Desenvolvido (Ambiente)';
    desc = homo.environment.description;
    nameOrigin = `${homo.environment.name} (${originRiskMap[homo.environment.type].name})`;
  }

  if (homo.characterization) {
    typeOrigin = `GSE Desenvolvido (${originRiskMap[homo.characterization.type].name})`;
    desc = homo.characterization.description;
    nameOrigin = `${homo.characterization.name} `;
  }

  if (hierarchyTree && homo.type == HomoTypeEnum.HIERARCHY) {
    const hierarchy = hierarchyTree[homo.id] || hierarchyTree[homo.name];

    if (hierarchy) {
      typeOrigin = `GSE Desenvolvido (${originRiskMap[hierarchy.type].name})`;
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

  return {
    nameOrigin,
    desc,
    descRh,
    typeOrigin,
  };
};
