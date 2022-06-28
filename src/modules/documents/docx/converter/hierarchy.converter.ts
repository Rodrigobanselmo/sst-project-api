import { HierarchyEnum } from '@prisma/client';
import { HomoGroupEntity } from '../../../../modules/company/entities/homoGroup.entity';
import { removeDuplicate } from '../../../../shared/utils/removeDuplicate';
import { HierarchyEntity } from '../../../company/entities/hierarchy.entity';

import { hierarchyMap } from '../components/tables/appr/parts/first/first.constant';

export interface HierarchyMapData {
  org: {
    type: string;
    typeEnum: string;
    name: string;
    id: string;
    homogeneousGroupIds: string[];
    homogeneousGroup: string;
  }[];
  allHomogeneousGroupIds: string[];
  workspace: string;
  descRh: string;
  descReal: string;
  employeesLength: number;
}

export type IHierarchyData = Map<string, HierarchyMapData>;

export type IHierarchyMap = Record<
  string,
  HierarchyEntity & {
    children: string[];
  }
>;

export type IHomoGroupMap = Record<string, HomoGroupEntity>;

const setMapHierarchies = (hierarchyData: HierarchyEntity[]) => {
  const hierarchyTree = {} as IHierarchyMap;
  const homoGroupTree = {} as IHomoGroupMap;

  hierarchyData.forEach((hierarchy) => {
    hierarchyTree[hierarchy.id] = { ...hierarchy, children: [] };
    hierarchy.homogeneousGroups.forEach((homogeneousGroup) => {
      homoGroupTree[homogeneousGroup.id] = {
        ...homogeneousGroup,
      };
    });
  });

  Object.values(hierarchyTree).forEach((hierarchy) => {
    if (hierarchy.parentId) {
      hierarchyTree[hierarchy.parentId].children.push(hierarchy.id);
    }
  });

  return { hierarchyTree, homoGroupTree };
};

export const hierarchyConverter = (hierarchies: HierarchyEntity[]) => {
  const { hierarchyTree, homoGroupTree } = setMapHierarchies(hierarchies);
  const hierarchyData = new Map<string, HierarchyMapData>();

  hierarchies
    .filter((i) =>
      (
        [HierarchyEnum.OFFICE, HierarchyEnum.SUB_OFFICE] as HierarchyEnum[]
      ).includes(i.type),
    )
    .forEach((hierarchy) => {
      const hierarchyArrayData: HierarchyMapData['org'] = [];
      const hierarchyInfo = hierarchyMap[hierarchy.type];
      const allHomogeneousGroupIds = [];

      const loop = (parentId: string) => {
        if (!parentId) return;
        const parent = hierarchyTree[parentId];
        const parentInfo = hierarchyMap[parent.type];
        const homogeneousGroupIds =
          parent?.homogeneousGroups?.map((group) => group.id) || [];

        allHomogeneousGroupIds.push(...homogeneousGroupIds);

        hierarchyArrayData[parentInfo.index] = {
          type: parentInfo.text,
          typeEnum: parent.type,
          name: parent.name,
          id: parent.id,
          homogeneousGroupIds,
          homogeneousGroup:
            parent?.homogeneousGroups?.map((group) => group.name).join(', ') ||
            '',
        };

        loop(parent.parentId);
      };

      const homogeneousGroupIds =
        hierarchy?.homogeneousGroups?.map((group) => group.id) || [];

      hierarchyArrayData[hierarchyInfo.index] = {
        type: hierarchyInfo.text,
        typeEnum: hierarchy.type,
        name: hierarchy.name,
        id: hierarchy.id,
        homogeneousGroupIds,
        homogeneousGroup:
          hierarchy?.homogeneousGroups?.map((group) => group.name).join(', ') ||
          '',
      };

      allHomogeneousGroupIds.push(...homogeneousGroupIds);
      loop(hierarchy.parentId);

      hierarchyData.set(hierarchy.id, {
        org: hierarchyArrayData.filter((hierarchyInfo) => hierarchyInfo),
        workspace: hierarchy.workspaces[0].name, //! Make it possible for many workspaces
        descRh: hierarchy.description,
        descReal: hierarchy.realDescription,
        employeesLength: hierarchy?.employees?.length || 0,
        allHomogeneousGroupIds: removeDuplicate(allHomogeneousGroupIds, {
          simpleCompare: true,
        }),
      });
    });

  return { hierarchyData, homoGroupTree, hierarchyTree };
};
