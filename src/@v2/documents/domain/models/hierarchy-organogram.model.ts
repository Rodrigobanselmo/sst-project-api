import { HierarchyTypeEnum } from "@/@v2/shared/domain/enum/company/hierarchy-type.enum";
import { hierarchyMap } from "../../application/libs/docx/components/tables/appr/parts/first/first.constant";
import { DocumentVersionModel } from "./document-version.model";
import { HierarchyModel } from "./hierarchy.model";
import { HomogeneousGroupModel } from "./homogeneous-group.model";
import { WorkspaceModel } from "./workspace.model";

export type IHierarchyOrganogramModel = {
  documentVersion: DocumentVersionModel
  hierarchies: HierarchyModel[]
  homogeneousGroups: HomogeneousGroupModel[]

  homogeneousGroupsMap: Record<string, HomogeneousGroupModel>
  hierarchiesMap: Record<string, HierarchyModel>
}

type OrganogramType = { hierarchy: HierarchyModel; homogeneousGroups: HomogeneousGroupModel[]; }
type OrganogramItemType = { hierarchy: HierarchyModel; allHomogeneousGroups: HomogeneousGroupModel[]; organogram: OrganogramType[] }
type OrganogramMapType = Record<string, OrganogramItemType>

export class HierarchyOrganogramModel {
  workspace: WorkspaceModel;
  organogramMap: OrganogramMapType
  organogramAllMap: OrganogramMapType

  constructor(params: IHierarchyOrganogramModel) {
    const { organogramAllMap, organogramMap } = this.#getOrganogramMap(params)

    this.workspace = params.documentVersion.documentBase.workspace
    this.organogramAllMap = organogramAllMap
    this.organogramMap = organogramMap
  }

  get organogramMapArray() {
    return Object.values(this.organogramMap)
  }

  #getOrganogramMap(params: IHierarchyOrganogramModel) {
    const organogramAllMap: OrganogramMapType = {};
    const organogramMap: OrganogramMapType = {};

    const organogramTypeFactory = (hierarchy: HierarchyModel): OrganogramType => {
      return {
        hierarchy: hierarchy,
        homogeneousGroups: hierarchy.groups.map((group) => params.homogeneousGroupsMap[group.homogeneousGroupId]),
      };
    };

    params.hierarchies.forEach((hierarchy) => {
      const organogramArray: OrganogramType[] = [];
      const hierarchyInfo = hierarchyMap[hierarchy.type];

      const loop = (parentId: string) => {
        if (!parentId) return;
        const parent = params.hierarchiesMap[parentId];
        const parentInfo = hierarchyMap[parent.type];
        organogramArray[parentInfo.index] = organogramTypeFactory(parent);

        loop(parent.parentId);
      };

      loop(hierarchy.parentId);

      organogramArray[hierarchyInfo.index] = organogramTypeFactory(hierarchy);

      const isOffice = ([HierarchyTypeEnum.OFFICE, HierarchyTypeEnum.SUB_OFFICE] as HierarchyTypeEnum[]).includes(hierarchy.type);

      const organogram = organogramArray.filter((hierarchyInfo) => hierarchyInfo)
      const allHomogeneousGroups = organogram.reduce((acc, hierarchy) => [...acc, ...hierarchy.homogeneousGroups], [] as HomogeneousGroupModel[])

      organogramAllMap[hierarchy.id] = {
        hierarchy: hierarchy,
        allHomogeneousGroups,
        organogram,
      }

      if (isOffice) organogramMap[hierarchy.id] = organogramAllMap[hierarchy.id]
    });

    return { organogramAllMap, organogramMap }
  }
}