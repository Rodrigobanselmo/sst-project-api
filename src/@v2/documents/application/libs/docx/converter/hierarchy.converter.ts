import { EmployeeModel } from "@/@v2/documents/domain/models/employee.model";
import { HierarchyGroupModel } from "@/@v2/documents/domain/models/hierarchy-groups.model";
import { IHierarchyModel } from "@/@v2/documents/domain/models/hierarchy.model";
import { HomogeneousGroupModel } from "@/@v2/documents/domain/models/homogeneous-group.model";
import { WorkspaceModel } from "@/@v2/documents/domain/models/workspace.model";
import { HierarchyTypeEnum } from "@/@v2/shared/domain/enum/company/hierarchy-type.enum";
import { removeDuplicate } from "@/shared/utils/removeDuplicate";
import { HierarchyEnum } from "@prisma/client";
import { hierarchyMap } from "../components/tables/appr/parts/first/first.constant";
import { RiskDataModel } from "@/@v2/documents/domain/models/risk-data.model";
import { DocumentVersionModel } from "@/@v2/documents/domain/models/document-version.model";
import { CompanyModel } from "@/@v2/documents/domain/models/company.model";
import { IDocumentsRequirementKeys } from "@/@v2/shared/domain/types/document/document-types.type";


export type IHierarchyDataConverter = IHierarchyModel & {
  homogeneousGroups: HomogeneousGroupModel[];
  hierarchyOnHomogeneous: HierarchyGroupModel & {
    homogeneousGroup: HomogeneousGroupModel
  }
}
export type IGHODataConverter = { gho: HomogeneousGroupModel; employeeCount: number; hierarchies: IHierarchyDataConverter[] }

export type IRiskGroupDataConverter = { riskData: RiskDataModel; homogeneousGroup: IGHODataConverter }
export type IDocumentRiskGroupDataConverter = { riskGroupData: IRiskGroupDataConverter[]; documentVersion: DocumentVersionModel }


export interface HierarchyMapData {
  org: {
    type: string;
    typeEnum: HierarchyTypeEnum;
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
  IHierarchyDataConverter & {
    children: string[];
  }
>;

export type IHomoGroupMap = Record<string, IGHODataConverter>;
export type IRiskMap = Record<string, { name: string }>;

const setMapHierarchies = (hierarchyData: IHierarchyDataConverter[]) => {
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
          employeeCount: 0,
          hierarchies: [],
        } as any;

      homoGroupTree[homogeneousGroup.id] = {
        gho: homogeneousGroup,
        employeeCount: 0,
        hierarchies: [...homoGroupTree[homogeneousGroup.id].hierarchies, hierarchy],
      };
    });
  });

  Object.values(homoGroupTree).forEach((homoGroup) => {
    const employees: EmployeeModel[] = [];
    homoGroupTree[homoGroup.gho.id].hierarchies.forEach((h) => {
      employees.push(...h.employees);
    });

    homoGroup.gho.isCharacterization

    homoGroupTree[homoGroup.gho.id].employeeCount = removeDuplicate(employees, {
      removeById: 'id',
    }).length;
  });

  return { hierarchyTree, homoGroupTree };
};

export const hierarchyConverter = (
  hierarchies: IHierarchyDataConverter[],
  homoGroup = [] as HomogeneousGroupModel[],
  workspace: WorkspaceModel,
  company: CompanyModel,
  documentType: IDocumentsRequirementKeys,
) => {
  const { hierarchyTree, homoGroupTree } = setMapHierarchies(hierarchies);
  const hierarchyData = new Map<string, HierarchyMapData>();
  const hierarchyHighLevelsData = new Map<string, HierarchyMapData>();

  hierarchies.forEach((hierarchy) => {
    const hierarchyArrayData: HierarchyMapData['org'] = [];
    const hierarchyInfo = hierarchyMap[hierarchy.type];
    const allHomogeneousGroupIds = [] as string[];

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
              if (!group.isEnviroment) return;
              return (homoGroup.find((e) => e.id === group.id) || {})?.name || '';
            })
            .filter((e) => e)
            .join(', ') || '',
        homogeneousGroup:
          parent?.homogeneousGroups
            ?.map((group) => {
              if (!group.isGHO) return false;
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
            if (!group.isEnviroment) return;
            return (homoGroup.find((e) => e.id === group.id) || {})?.name || '';
          })
          .filter((e) => e)
          .join(', ') || '',
      homogeneousGroup:
        hierarchy?.homogeneousGroups
          ?.map((group) => {
            if (!group.isGHO) return false;
            return group.name;
          })
          .filter((e) => e)
          .join(', ') || '',
    };

    allHomogeneousGroupIds.push(...homogeneousGroupIds);
    loop(hierarchy.parentId);

    const isOffice = ([HierarchyEnum.OFFICE, HierarchyEnum.SUB_OFFICE] as HierarchyEnum[]).includes(hierarchy.type);

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

  const riskGroupData: IRiskGroupDataConverter[] = [];

  homoGroup.forEach((gho) => {
    gho.risksData({ companyId: company.id, documentType }).forEach((riskData) => {
      riskGroupData.push({
        homogeneousGroup: homoGroupTree[gho.id],
        riskData,
      })
    })
  })


  return {
    hierarchyData,
    hierarchyHighLevelsData,
    homoGroupTree,
    hierarchyTree,
    riskGroupData
  };
};
