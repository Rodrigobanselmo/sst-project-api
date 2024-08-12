import { EmployeeEntity } from './../../../company/entities/employee.entity';
import { HierarchyEnum, HomoTypeEnum } from '@prisma/client';

import { HomoGroupEntity } from '../../../../modules/company/entities/homoGroup.entity';
import { removeDuplicate } from '../../../../shared/utils/removeDuplicate';
import { HierarchyEntity } from '../../../company/entities/hierarchy.entity';
import { hierarchyMap } from '../components/tables/appr/parts/first/first.constant';
import { CharacterizationEntity } from './../../../company/entities/characterization.entity';

export interface HierarchyMapData {
  org: {
    type: string;
    typeEnum: HierarchyEnum;
    name: string;
    id: string;
    homogeneousGroupIds: string[];
    homogeneousGroup: string;
    environments: string;
  }[];
  allHomogeneousGroupIds: string[];
  workspace: string;
  descRh: string;
  descReal: string;
  employeesLength: number;
  subEmployeesLength: number;
}

export type IHierarchyData = Map<string, HierarchyMapData>;

export type IHierarchyMap = Record<
  string,
  HierarchyEntity & {
    children: string[];
  }
>;

export type IHomoGroupMap = Record<string, HomoGroupEntity>;
export type IRiskMap = Record<string, { name: string }>;

const setMapHierarchies = (hierarchyData: HierarchyEntity[]) => {
  const hierarchyTree = {} as IHierarchyMap;
  const homoGroupTree = {} as IHomoGroupMap;

  hierarchyData.forEach((hierarchy) => {
    hierarchyTree[hierarchy.id] = { ...hierarchy, children: [] };
  });

  Object.values(hierarchyTree).forEach((hierarchy) => {
    if (hierarchy.parentId) {
      hierarchyTree[hierarchy.parentId].children.push(hierarchy.id);
      if (!hierarchyTree[hierarchy.parentId].employees) hierarchyTree[hierarchy.parentId].employees = [];

      if (hierarchy.type !== 'SUB_OFFICE') hierarchyTree[hierarchy.parentId].employees.push(...hierarchy.employees);
    }
  });

  Object.values(hierarchyTree).forEach((h) => {
    hierarchyTree[h.id].employees = removeDuplicate(hierarchyTree[h.id].employees, { removeById: 'id' });

    const hierarchy = hierarchyTree[h.id];

    hierarchy.homogeneousGroups.forEach((homogeneousGroup) => {
      if (!homoGroupTree[homogeneousGroup.id])
        homoGroupTree[homogeneousGroup.id] = {
          hierarchies: [],
        } as any;

      homoGroupTree[homogeneousGroup.id] = {
        ...homogeneousGroup,
        hierarchies: [...homoGroupTree[homogeneousGroup.id].hierarchies, hierarchy],
      };
    });
  });

  Object.values(homoGroupTree).forEach((homoGroup) => {
    const employees: EmployeeEntity[] = [];
    homoGroupTree[homoGroup.id].hierarchies.forEach((h) => {
      employees.push(...h.employees);
    });

    homoGroupTree[homoGroup.id].employeeCount = removeDuplicate(employees, {
      removeById: 'id',
    }).length;
  });

  return { hierarchyTree, homoGroupTree };
};

export const hierarchyConverter = (
  hierarchies: HierarchyEntity[],
  environments = [] as CharacterizationEntity[],
  { workspaceId }: { workspaceId?: string } = {},
) => {
  const { hierarchyTree, homoGroupTree } = setMapHierarchies(hierarchies);
  const hierarchyData = new Map<string, HierarchyMapData>();
  const hierarchyHighLevelsData = new Map<string, HierarchyMapData>();

  hierarchies.forEach((hierarchy) => {
    const hierarchyArrayData: HierarchyMapData['org'] = [];
    const hierarchyInfo = hierarchyMap[hierarchy.type];
    const allHomogeneousGroupIds = [];

    const loop = (parentId: string) => {
      if (!parentId) return;
      const parent = hierarchyTree[parentId];
      const parentInfo = hierarchyMap[parent.type];
      const homogeneousGroupIds = parent?.homogeneousGroups?.map((group) => group.id) || [];

      allHomogeneousGroupIds.push(...homogeneousGroupIds);

      hierarchyArrayData[parentInfo.index] = {
        type: parentInfo.text,
        typeEnum: parent.type,
        name: parent.name,
        id: parent.id,
        homogeneousGroupIds,
        environments:
          parent?.homogeneousGroups
            ?.map((group) => {
              if (group.type != HomoTypeEnum.ENVIRONMENT) return;
              return (environments.find((e) => e.id === group.id) || {})?.name || '';
            })
            .filter((e) => e)
            .join(', ') || '',
        homogeneousGroup:
          parent?.homogeneousGroups
            ?.map((group) => {
              if (group.type) return false;
              return group.name;
            })
            .filter((e) => e)
            .join(', ') || '',
      };

      loop(parent.parentId);
    };

    const homogeneousGroupIds = hierarchy?.homogeneousGroups?.map((group) => group.id) || [];

    hierarchyArrayData[hierarchyInfo.index] = {
      type: hierarchyInfo.text,
      typeEnum: hierarchy.type,
      name: hierarchy.name,
      id: hierarchy.id,
      homogeneousGroupIds,
      environments:
        hierarchy?.homogeneousGroups
          ?.map((group) => {
            if (group.type != HomoTypeEnum.ENVIRONMENT) return;
            return (environments.find((e) => e.id === group.id) || {})?.name || '';
          })
          .filter((e) => e)
          .join(', ') || '',
      homogeneousGroup:
        hierarchy?.homogeneousGroups
          ?.map((group) => {
            if (group.type) return false;
            return group.name;
          })
          .filter((e) => e)
          .join(', ') || '',
    };

    allHomogeneousGroupIds.push(...homogeneousGroupIds);
    loop(hierarchy.parentId);

    const isOffice = ([HierarchyEnum.OFFICE, HierarchyEnum.SUB_OFFICE] as HierarchyEnum[]).includes(hierarchy.type);

    const workspace = workspaceId
      ? hierarchy.workspaces.find((workspace) => workspace.id === workspaceId) || hierarchy.workspaces[0]
      : hierarchy.workspaces[0];

    if (isOffice)
      hierarchyData.set(hierarchy.id, {
        org: hierarchyArrayData.filter((hierarchyInfo) => hierarchyInfo),
        workspace: workspace.name, //! (done, just test now) Make it possible for many workspaces
        descRh: hierarchy.description,
        descReal: hierarchy.realDescription,
        employeesLength: hierarchy?.employees?.length || 0,
        subEmployeesLength: hierarchy?.subOfficeEmployees?.length || 0,
        allHomogeneousGroupIds: removeDuplicate(allHomogeneousGroupIds, {
          simpleCompare: true,
        }),
      });

    hierarchyHighLevelsData.set(hierarchy.id, {
      org: hierarchyArrayData.filter((hierarchyInfo) => hierarchyInfo),
      workspace: workspace.name, //! (done, just test now) Make it possible for many workspaces
      descRh: hierarchy.description,
      descReal: hierarchy.realDescription,
      employeesLength: hierarchy?.employees?.length || 0,
      subEmployeesLength: hierarchy?.subOfficeEmployees?.length || 0,
      allHomogeneousGroupIds: removeDuplicate(allHomogeneousGroupIds, {
        simpleCompare: true,
      }),
    });
  });

  return {
    hierarchyData,
    hierarchyHighLevelsData,
    homoGroupTree,
    hierarchyTree,
  };
};
