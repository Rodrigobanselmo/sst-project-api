import { HierarchyEnum } from '@prisma/client';
import { HierarchyEntity } from 'src/modules/company/entities/hierarchy.entity';

import { hierarchyMap } from '../parts/first/first.constant';

export interface MapData {
  org: {
    type: string;
    name: string;
    homogeneousGroup: string;
  }[];
  workspace: string;
  descRh: string;
  descReal: string;
  employeesLength: number;
}

export type IHierarchyData = Map<string, MapData>;

type IHierarchyMap = Record<
  string,
  HierarchyEntity & {
    children: string[];
  }
>;

const setMapHierarchies = (hierarchyData: HierarchyEntity[]) => {
  const hierarchyTree = {} as IHierarchyMap;

  hierarchyData.forEach((hierarchy) => {
    hierarchyTree[hierarchy.id] = { ...hierarchy, children: [] };
  });

  Object.values(hierarchyTree).forEach((hierarchy) => {
    if (hierarchy.parentId) {
      hierarchyTree[hierarchy.parentId].children.push(hierarchy.id);
    }
  });

  return hierarchyTree;
};

export const hierarchyConverter = (hierarchies: HierarchyEntity[]) => {
  const hierarchyTree = setMapHierarchies(hierarchies);
  const hierarchyData = new Map<string, MapData>();

  hierarchies
    .filter((i) =>
      (
        [HierarchyEnum.OFFICE, HierarchyEnum.SUB_OFFICE] as HierarchyEnum[]
      ).includes(i.type),
    )
    .forEach((hierarchy) => {
      const hierarchyArrayData: MapData['org'] = [];
      const hierarchyInfo = hierarchyMap[hierarchy.type];

      const loop = (parentId: string) => {
        if (!parentId) return;
        const parent = hierarchyTree[parentId];
        const parentInfo = hierarchyMap[parent.type];

        hierarchyArrayData[parentInfo.index] = {
          type: parentInfo.text,
          name: parent.name,
          homogeneousGroup:
            parent?.homogeneousGroups?.map((group) => group.name).join(', ') ||
            '',
        };

        loop(parent.parentId);
      };

      hierarchyArrayData[hierarchyInfo.index] = {
        type: hierarchyInfo.text,
        name: hierarchy.name,
        homogeneousGroup:
          hierarchy?.homogeneousGroups?.map((group) => group.name).join(', ') ||
          '',
      };

      loop(hierarchy.parentId);

      hierarchyData.set(hierarchy.id, {
        org: hierarchyArrayData.filter((hierarchyInfo) => hierarchyInfo),
        workspace: hierarchy.workplace.name,
        descRh: hierarchy.description,
        descReal: hierarchy.realDescription,
        employeesLength: hierarchy?.employees?.length || 0,
      });
    });

  return hierarchyData;
};
