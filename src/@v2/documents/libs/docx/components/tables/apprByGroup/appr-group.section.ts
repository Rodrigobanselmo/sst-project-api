import { HomoTypeEnum } from '@prisma/client';
import { ISectionOptions, Paragraph, Table } from 'docx';

import { removeDuplicate } from '@/@v2/shared/utils/helpers/remove-duplicate';
import { sortString } from '@/@v2/shared/utils/sorts/string.sort';
import { sectionLandscapeRiskInventoryAnnexProperties } from '../../../base/config/styles';
import { originRiskMap } from '../../../constants/origin-risk';
import { HierarchyMapData, IDocumentRiskGroupDataConverter, IGHODataConverter, IHierarchyData, IHierarchyDataConverter, IHierarchyMap, IHomoGroupMap } from '../../../converter/hierarchy.converter';
import { riskInventoryAnnexByGseHeadersFooters } from '../appr/riskInventoryAnnexSectionFrame';
import { officeRiskInventoryTableSection } from './parts/2-offices/offices.table';
import { firstRiskInventoryTableSection } from './parts/first/first.table';
import { secondRiskInventoryTableSection } from './parts/second/second.table';
import { thirdRiskInventoryTableSection } from './parts/third/third.table';
import { epiRiskInventoryTableSection } from './parts/epi/epi.table';
import { resolveHomogeneousGroupInventoryDescription } from '../appr/resolve-homogeneous-group-description.util';

export interface IAPPRTableOptions {
  isHideCA: boolean;
  isHideOrigin: boolean;
}

const resolveHierarchyNode = (gho: IGHODataConverter['gho'], hierarchyTree: IHierarchyMap) => {
  return hierarchyTree[gho.id] || hierarchyTree[gho.name];
};

const getHomoPgrRisksCount = (homo: IGHODataConverter, homoGroupTree: IHomoGroupMap) => {
  const node = homoGroupTree[homo.gho.id];
  if (!node?.gho) return 0;

  return node.gho.risksData({ documentType: 'isPGR' }).length;
};

export const APPRByGroupTableSection = (
  riskFactorGroupData: IDocumentRiskGroupDataConverter,
  hierarchyData: IHierarchyData,
  hierarchyTree: IHierarchyMap,
  homoGroupTree: IHomoGroupMap,
  options: IAPPRTableOptions,
): ISectionOptions[] => {
  const sectionsTables = [] as (Table | Paragraph)[][];
  const isByGroup = true;
  let workspace = '';

  hierarchyData.forEach((hierarchy) => {
    if (workspace) return;
    if (hierarchy.workspace) workspace = hierarchy.workspace;
  });

  const hierarchyDataHomoGroup = new Map<string, HierarchyMapData & { hierarchies: IHierarchyDataConverter[] }>();

  const everyHomoFound = [] as string[];
  const everyHomoNotFound = [] as string[];

  const setHomoGroup = (homo: IGHODataConverter) => {
    const homoGroupNode = homoGroupTree[homo.gho.id];
    if (!homoGroupNode) return;

    const hierarchy =
      homo.gho.type === HomoTypeEnum.HIERARCHY ? resolveHierarchyNode(homo.gho, hierarchyTree) : undefined;

    if (homo.gho.type === HomoTypeEnum.HIERARCHY && !hierarchy) {
      if (getHomoPgrRisksCount(homo, homoGroupTree) === 0) return;

      console.warn(
        `[APPRByGroup] Orphan HIERARCHY homogeneous group without matching hierarchy (has risks): id=${homo.gho.id}`,
      );
    }

    const { desc, descRh, nameOrigin, typeOrigin } = getHomoGroupName(homo, hierarchyTree);

    hierarchyDataHomoGroup.set(homo.gho.id, {
      hierarchies: homoGroupNode.hierarchies,
      allHomogeneousGroupIds: [homo.gho.id],
      descReal: desc,
      descRh: descRh || desc,
      employeesLength: homo.employeeCount,
      org: [
        {
          id: homo.gho.id,
          name: nameOrigin,
          homogeneousGroup: nameOrigin,
          environments: '',
          homogeneousGroupIds: [homo.gho.id],
          type: '',
          typeEnum: homo.gho.type === HomoTypeEnum.HIERARCHY ? (hierarchy?.type ?? ('' as any)) : ('' as any),
        },
      ],
      workspace,
      type: typeOrigin,
    } as any);
  };

  Object.values(homoGroupTree)
    .sort((a, b) => sortString(a.gho.name, b.gho.name))
    .forEach((homo) => {
      if (homo.gho.type) return;

      const foundHomo = hierarchyDataHomoGroup.get(homo.gho.id);

      if (!foundHomo) setHomoGroup(homo);
      everyHomoFound.push(homo.gho.id);

      homoGroupTree[homo.gho.id].hierarchies.forEach((hierarchy, _i, hierarchies) => {
        const allHomogeneousGroupIds = (hierarchyData.get(hierarchy.id) || { allHomogeneousGroupIds: [] })?.allHomogeneousGroupIds;

        removeDuplicate([...allHomogeneousGroupIds.map((id: string) => ({ id })), ...hierarchy.homogeneousGroups], {
          idPath: 'id',
        }).forEach((homoGroup) => {
          const isOnEvery = hierarchies.every((hierarchyEvery) => {
            const everyAllHomogeneousGroupIds = (
              hierarchyData.get(hierarchyEvery.id) || {
                allHomogeneousGroupIds: [],
              }
            )?.allHomogeneousGroupIds;

            return [...everyAllHomogeneousGroupIds.map((id) => ({ id })), ...hierarchyEvery.homogeneousGroups].find((h) => h.id === homoGroup.id);
          });

          const mapDataHomo = hierarchyDataHomoGroup.get(homo.gho.id)!;
          const isHomoAdded = mapDataHomo?.allHomogeneousGroupIds.find((homoId) => homoId === homoGroup.id);

          if (isOnEvery && !isHomoAdded) {
            everyHomoFound.push(homoGroup.id);
            const allHomogeneousGroupIds = [...(mapDataHomo?.allHomogeneousGroupIds || []), homoGroup.id];

            hierarchyDataHomoGroup.set(homo.gho.id, {
              descReal: mapDataHomo.descRh || '',
              descRh: mapDataHomo.descRh || '',
              employeesLength: mapDataHomo.employeesLength,
              org: mapDataHomo.org,
              subEmployeesLength: mapDataHomo.subEmployeesLength,
              workspace: mapDataHomo.workspace,
              allHomogeneousGroupIds,
              hierarchies: homoGroupTree[homo.gho.id].hierarchies,
            });
          }

          if (!isOnEvery) {
            everyHomoNotFound.push(homoGroup.id);
          }
        });
      });
    });

  Object.values(homoGroupTree).forEach((homo) => {
    const hasFound = everyHomoFound.includes(homo.gho.id);
    // const isNotOnEvery = everyHomoNotFound.includes(homo.id);
    if (!hasFound) {
      setHomoGroup(homo);
    }
  });

  hierarchyDataHomoGroup.forEach((hierarchy) => {
    const createTable = () => {
      const epis = hierarchy.allHomogeneousGroupIds
        .map((id) => {
          return homoGroupTree[id].gho.risksData({ documentType: 'isPGR' }).map((risk) => risk.epis.map((epi) => epi).flat());
        })
        .flat(2);

      const episDeduplicated = epis.filter((epi, index, self) => index === self.findIndex((t) => t.ca === epi.ca));

      const firstTable = firstRiskInventoryTableSection(riskFactorGroupData, homoGroupTree, hierarchy, isByGroup, {
        omitInventoryBannerRow: true,
      });
      const officeTable = officeRiskInventoryTableSection(hierarchy);
      const secondTable = secondRiskInventoryTableSection(hierarchy, isByGroup);
      const epiTable = epiRiskInventoryTableSection(episDeduplicated, options.isHideCA);
      const thirdTable = thirdRiskInventoryTableSection(riskFactorGroupData, hierarchy, hierarchyTree, options);

      sectionsTables.push([firstTable, ...officeTable, ...secondTable, ...epiTable, ...thirdTable]);
    };
    createTable();
  });

  const setSection = (tables: any[]) => ({
    children: [...tables],
    ...riskInventoryAnnexByGseHeadersFooters(),
    properties: sectionLandscapeRiskInventoryAnnexProperties,
  });

  return sectionsTables.map((table) => setSection(table));
};

export const getHomoGroupName = (homo: IGHODataConverter, hierarchyTree?: IHierarchyMap) => {
  let nameOrigin: string = '';
  let desc: string = '';
  let descRh: string = '';
  let typeOrigin: string = '';

  if (homo.gho.isEnviroment && homo.gho.characterization) {
    typeOrigin = 'GSE Desenvolvido (Ambiente)';
    desc = resolveHomogeneousGroupInventoryDescription(homo.gho, hierarchyTree);
    nameOrigin = `${homo.gho.characterization.name} (${originRiskMap[homo.gho.characterization.type].name})`;
  }

  if (homo.gho.isCharacterization && homo.gho.characterization) {
    typeOrigin = `GSE Desenvolvido (${originRiskMap[homo.gho.characterization.type].name})`;
    desc = resolveHomogeneousGroupInventoryDescription(homo.gho, hierarchyTree);
    nameOrigin = `${homo.gho.characterization.name} `;
  }

  if (hierarchyTree && homo.gho.type == HomoTypeEnum.HIERARCHY) {
    const hierarchy = resolveHierarchyNode(homo.gho, hierarchyTree);

    if (hierarchy) {
      typeOrigin = `GSE Desenvolvido (${originRiskMap[hierarchy.type].name})`;
      nameOrigin = `${hierarchy.name}`;
      desc = resolveHomogeneousGroupInventoryDescription(homo.gho, hierarchyTree);
      descRh = hierarchy.description;
    } else {
      typeOrigin = 'GSE Desenvolvido';
      nameOrigin = homo.gho.name || homo.gho.id;
      desc = resolveHomogeneousGroupInventoryDescription(homo.gho, hierarchyTree);
    }
  }

  if (!homo.gho.type) {
    typeOrigin = 'GSE';
    desc = resolveHomogeneousGroupInventoryDescription(homo.gho, hierarchyTree);
    nameOrigin = homo.gho.name;
  }

  return {
    nameOrigin,
    desc,
    descRh,
    typeOrigin,
  };
};
