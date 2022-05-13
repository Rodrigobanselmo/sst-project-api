import { HierarchyEnum } from '@prisma/client';
import { HierarchyEntity } from 'src/modules/company/entities/hierarchy.entity';

import { hierarchyMap } from '../first.constant';

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
  const hierarchyData = new Map<string, string[][]>();

  hierarchies
    .filter((i) =>
      (
        [HierarchyEnum.OFFICE, HierarchyEnum.SUB_OFFICE] as HierarchyEnum[]
      ).includes(i.type),
    )
    .forEach((hierarchy) => {
      const hierarchyArrayData: string[][] = [];
      const hierarchyInfo = hierarchyMap[hierarchy.type];

      const loop = (parentId: string) => {
        if (!parentId) return;

        const parent = hierarchyTree[parentId];
        const parentInfo = hierarchyMap[parent.type];

        hierarchyArrayData[parentInfo.index] = [parentInfo.text, parent.name];

        loop(parent.parentId);
      };

      hierarchyArrayData[hierarchyInfo.index] = [
        hierarchyInfo.text,
        hierarchy.name,
      ];

      loop(hierarchy.parentId);
      hierarchyData.set(hierarchy.id, hierarchyArrayData);
    });

  return hierarchyData;
};
