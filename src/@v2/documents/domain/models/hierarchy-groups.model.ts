export type IHierarchyGroupModel = {
  homogeneousGroupId: string;
  hierarchyId: string;
  endDate: Date | null;
  startDate: Date | null;
}

export class HierarchyGroupModel {
  homogeneousGroupId: string;
  hierarchyId: string;
  endDate: Date | null;
  startDate: Date | null;


  constructor(params: IHierarchyGroupModel) {
    this.homogeneousGroupId = params.homogeneousGroupId
    this.hierarchyId = params.hierarchyId
    this.endDate = params.endDate
    this.startDate = params.startDate
  }
}
