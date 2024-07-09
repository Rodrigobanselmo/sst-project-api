import { Injectable } from '@nestjs/common';
import { HierarchyEnum } from '@prisma/client';
import { v4 } from 'uuid';

import { HierarchyEntity } from '../../../modules/company/entities/hierarchy.entity';
import { removeDuplicate } from '../../../shared/utils/removeDuplicate';

type hierarchyMap = Record<
  string,
  HierarchyEntity & {
    children: (string | number)[];
  }
>;

@Injectable()
export class HierarchyExcelProvider {
  // transform array on tree map
  transformArrayToHierarchyMapTree(hierarchies: HierarchyEntity[]) {
    const hierarchyTree = hierarchies.reduce((acc, node) => {
      acc[node.id] = {
        ...node,
        parentId: node.parentId || null,
        children: [],
      };

      return acc;
    }, {}) as hierarchyMap;

    Object.values(hierarchyTree).forEach((node) => {
      if (node.parentId) {
        hierarchyTree[node.parentId].children.push(node.id);
      }
    });

    return hierarchyTree;
  }

  createTreeMapFromHierarchyStruct(
    hierarchies: {
      workspaceIds: string[];
      directory?: string;
      management?: string;
      sector?: string;
      sub_sector?: string;
      office?: string;
      sub_office?: string;
      ghoName?: string;
      description?: string;
      realDescription?: string;
    }[],
  ) {
    const hierarchyMap = {} as any;
    hierarchies.forEach((hierarchy) => {
      let orderedHierarchy = [] as {
        key: string;
        value: string | number;
        id: string;
      }[];

      Object.entries(hierarchy).forEach(([key, value]) => {
        if (key === 'directory' && value) orderedHierarchy[0] = { key, value: value as string, id: v4() };
        if (key === 'management' && value) orderedHierarchy[1] = { key, value: value as string, id: v4() };
        if (key === 'sector' && value) orderedHierarchy[2] = { key, value: value as string, id: v4() };
        if (key === 'sub_sector' && value) orderedHierarchy[3] = { key, value: value as string, id: v4() };
        if (key === 'office' && value) orderedHierarchy[4] = { key, value: value as string, id: v4() };
        if (key === 'sub_office' && value) orderedHierarchy[5] = { key, value: value as string, id: v4() };
      });

      orderedHierarchy = orderedHierarchy.filter((i) => i);

      orderedHierarchy.forEach((employeeWork, index) => {
        if (employeeWork) {
          const id = employeeWork.id;

          if (!hierarchyMap[id]) hierarchyMap[id] = {};

          hierarchyMap[id].id = id;
          hierarchyMap[id].workspaceIds = hierarchy.workspaceIds;
          hierarchyMap[id].description = hierarchy.description;
          hierarchyMap[id].realDescription = hierarchy.realDescription;
          hierarchyMap[id].ghoName = hierarchy.ghoName;
          if (hierarchy.ghoName) {
            if (!hierarchyMap[id].ghoNames) hierarchyMap[id].ghoNames = [];
            hierarchyMap[id].ghoNames.push(hierarchy.ghoName);
          }
          hierarchyMap[id].name = employeeWork.value;
          hierarchyMap[id].type = employeeWork.key.toUpperCase() as HierarchyEnum;
          hierarchyMap[id].parentId = index === 0 ? null : orderedHierarchy[index - 1].id;

          if (orderedHierarchy[index - 1] && index !== 0) {
            const _id = orderedHierarchy[index - 1].id;
            if (!hierarchyMap[_id].children) {
              hierarchyMap[_id].children = [];
            }
            hierarchyMap[_id].children.push(id);
          }
        }
      });
    });

    return hierarchyMap;
  }

  compare(allMap: hierarchyMap, compareMap: hierarchyMap) {
    const newHierarchy = { ...compareMap } as Record<string, any>;

    const isEqualHierarchy = (
      h1: HierarchyEntity & {
        children: (string | number)[];
      },
      h2: HierarchyEntity & {
        children: (string | number)[];
      },
      parent?,
    ) => {
      const firstEqual =
        (h1.name || '')
          .toLowerCase()
          .normalize('NFD')
          .replace(/[^a-zA-Z0-9s]/g, '') ===
          (h2.name || '')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[^a-zA-Z0-9s]/g, '') &&
        h1.type === h2.type &&
        h1.workspaceIds.some((i) => h2.workspaceIds.includes(i));

      if (parent) {
        if (newHierarchy[h1.parentId] && newHierarchy[h2.parentId]) {
          const parentEqual = isEqualHierarchy(newHierarchy[h1.parentId], newHierarchy[h2.parentId]);

          return parentEqual && firstEqual;
        }

        if (h1.parentId === h2.parentId && h2.parentId === null) return firstEqual;

        return false;
      }

      return firstEqual;
    };

    const replaceAndEditIfEqual = (allHierarchy, hierarchy, parentId?) => {
      if (!newHierarchy[allHierarchy.id])
        newHierarchy[allHierarchy.id] = {
          ...allHierarchy,
          description: hierarchy?.description ?? allHierarchy.description,
          realDescription: hierarchy?.realDescription ?? allHierarchy.realDescription,
          ghoName: hierarchy?.ghoName ?? allHierarchy.ghoName,
          ghoNames: [...(hierarchy?.ghoNames || []), ...(allHierarchy?.ghoName || [])],
          fromOld: true,
        };

      if (newHierarchy[allHierarchy.id].workspaceIds && hierarchy.workspaceId) {
        newHierarchy[allHierarchy.id].workspaceIds = removeDuplicate(
          [...newHierarchy[allHierarchy.id].workspaceIds, ...hierarchy.workspaceId],
          {
            simpleCompare: true,
          },
        );
      }
      if (parentId) newHierarchy[allHierarchy.id].parentId = parentId;
      if (hierarchy.ghoName && !newHierarchy[allHierarchy.id]?.ghoNames?.includes(hierarchy.ghoName))
        newHierarchy[allHierarchy.id].ghoNames.push(hierarchy.ghoName);

      if (newHierarchy[hierarchy.id].children)
        newHierarchy[hierarchy.id].children.forEach((childId) => {
          if (!newHierarchy[allHierarchy.id].children) newHierarchy[allHierarchy.id].children = [];

          newHierarchy[allHierarchy.id].children.push(childId);

          newHierarchy[childId].parentId = allHierarchy.id;
          newHierarchy[childId].connectedToOldId = allHierarchy.connectedToOldId || allHierarchy.id;
        });

      delete newHierarchy[hierarchy.id];

      newHierarchy[hierarchy.id] = { refId: allHierarchy.id };
    };

    Object.keys(HierarchyEnum).forEach((type) =>
      Object.values(compareMap)
        .filter((i) => i.type === type)
        .forEach((hierarchy) => {
          if (!newHierarchy[hierarchy.id]) return;

          const parentId = newHierarchy[hierarchy.id].parentId;
          const connectedToOldId = newHierarchy[hierarchy.id].connectedToOldId;

          //get if exist on database and replace
          const equalAllHierarchy = Object.values(allMap).find((i) => isEqualHierarchy(i, hierarchy, true));

          if (equalAllHierarchy) {
            if (!parentId || parentId === equalAllHierarchy.parentId) {
              replaceAndEditIfEqual(equalAllHierarchy, hierarchy);
            } else if (connectedToOldId === equalAllHierarchy.parentId) {
              replaceAndEditIfEqual(equalAllHierarchy, hierarchy, parentId);
            }
          }

          // connect to old existent hierarchy
          if (
            newHierarchy[hierarchy.id] &&
            newHierarchy[hierarchy.id].parentId &&
            newHierarchy[newHierarchy[hierarchy.id].parentId] &&
            newHierarchy[newHierarchy[hierarchy.id].parentId].connectedToOldId
          ) {
            newHierarchy[hierarchy.id].connectedToOldId =
              newHierarchy[newHierarchy[hierarchy.id].parentId].connectedToOldId;
          }

          //if has other equal hierarchy
          const equalHierarchy = Object.values(newHierarchy).find(
            (i) => !i.fromOld && i.id !== hierarchy.id && isEqualHierarchy(i, hierarchy, true),
          );

          if (equalHierarchy && newHierarchy[hierarchy.id]) {
            replaceAndEditIfEqual(equalHierarchy, hierarchy);
          }
        }),
    );

    return newHierarchy;
  }

  getHierarchyPathMap(hierarchies: HierarchyEntity[]) {
    const map = this.transformArrayToHierarchyMapTree(hierarchies);

    // const hierarchyTree = hierarchies.reduce((acc, node) => {
    //   acc[node.id] = {
    //     ...node,
    //     parentId: node.parentId || null,
    //     children: [],
    //   };

    //   return acc;
    // }, {}) as hierarchyMap;

    // return hierarchyTree;
  }

  getPath(map: hierarchyMap, id: string) {
    const hierarchy = map[id];
    if (hierarchy) {
      const name = hierarchy.name;

      if (hierarchy.parentId) {
        const parentName = this.getPath(map, hierarchy.parentId);
        return `${parentName}-${name}`;
      }

      return name;
    }
  }
}
