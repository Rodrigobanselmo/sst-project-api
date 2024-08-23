import { HomoTypeEnum } from "@/@v2/shared/domain/enum/security/homo-type.enum";
import { hierarchyMap } from "../../application/libs/docx/components/tables/appr/parts/first/first.constant";
import { HierarchyAllData } from "../types/hierarchy-all-data";
import { DocumentVersionModel } from "./document-version.model";
import { HierarchyModel } from "./hierarchy.model";
import { HomogeneousGroupModel } from './homogeneous-group.model';
import { HierarchyOrganogramModel } from "./hierarchy-organogram.model";
import { HierarchyParentModel } from "./hierarchy-parent.model-delete";
import { HierarchyTypeEnum } from "@/@v2/shared/domain/enum/company/hierarchy-type.enum";

export type IDocumentPGRModel = {
  documentVersion: DocumentVersionModel
  hierarchies: HierarchyModel[]
  homogeneousGroups: HomogeneousGroupModel[]
}

export class DocumentPGRModel {
  documentVersion: DocumentVersionModel
  hierarchies: HierarchyModel[]
  homogeneousGroups: HomogeneousGroupModel[]

  homogeneousGroupsMap: Record<string, HomogeneousGroupModel>
  hierarchiesMap: Record<string, HierarchyModel>

  constructor(params: IDocumentPGRModel) {
    this.documentVersion = params.documentVersion;
    this.hierarchies = params.hierarchies
    this.homogeneousGroups = params.homogeneousGroups

    this.homogeneousGroupsMap = this.#getHomogeneousGroupsMap()
    this.hierarchiesMap = this.#getHierarchiesMap()
  }

  get documentBase() {
    return this.documentVersion.documentBase
  }

  get model() {
    return this.documentVersion.documentBase.model
  }

  get hierarchyOrganizationMap() {
    return #getHierarchyAllInfo()
  }

  #getHierarchyGroups(hierarchy: HierarchyModel) {
    return hierarchy.groups.map((group) => this.homogeneousGroupsMap[group.homogeneousGroupId])
  }

  #getHomogeneousGroupsMap() {
    return this.homogeneousGroups.reduce((acc, group) => ({ ...acc, [group.id]: group }), {})
  }

  #getHierarchiesMap() {
    return this.hierarchies.reduce((acc, group) => ({ ...acc, [group.id]: group }), {})
  }

  #getHierarchyAllInfo() {
    const hierarchyData = new Map<string, HierarchyOrganogramModel>();
    const hierarchyHighLevelsData = new Map<string, HierarchyOrganogramModel>();

    this.hierarchies.forEach((hierarchy) => {
      const hierarchyArrayData: HierarchyParentModel[] = [];
      const hierarchyInfo = hierarchyMap[hierarchy.type];

      const loop = (parentId: string) => {
        if (!parentId) return;
        const parent = this.hierarchiesMap[parentId];
        const parentInfo = hierarchyMap[parent.type];

        hierarchyArrayData[parentInfo.index] = new HierarchyParentModel({
          homogeneousGroups: this.#getHierarchyGroups(parent),
          id: parent.id,
          name: parent.name,
          type: parentInfo.text,
          typeEnum: parent.type,
        });

        loop(parent.parentId);
      };

      hierarchyArrayData[hierarchyInfo.index] = new HierarchyParentModel({
        homogeneousGroups: this.#getHierarchyGroups(hierarchy),
        type: hierarchyInfo.text,
        typeEnum: hierarchy.type,
        name: hierarchy.name,
        id: hierarchy.id,
      });

      loop(hierarchy.parentId);

      const isOffice = ([HierarchyTypeEnum.OFFICE, HierarchyTypeEnum.SUB_OFFICE] as HierarchyTypeEnum[]).includes(hierarchy.type);

      const workspace = this.documentBase.workspace

      const hierarchyParentsModel = new HierarchyOrganogramModel({
        org: hierarchyArrayData.filter((hierarchyInfo) => hierarchyInfo),
        workspace: workspace.name,
        descRh: hierarchy.description,
        descReal: hierarchy.realDescription,
        employeesLength: hierarchy.employees.length,
        subEmployeesLength: hierarchy.subOfficeEmployees.length,
      });

      if (isOffice) hierarchyData[hierarchy.id] = hierarchyParentsModel

      hierarchyHighLevelsData[hierarchy.id] = hierarchyParentsModel
    });

    return hierarchyData
  }
}
