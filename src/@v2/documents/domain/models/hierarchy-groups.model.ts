export type IHierarchyGroupModel = {
  homogeneousGroupId: string;
  hierarchyId: string;
  endDate: Date;
  startDate: Date;
}

export class HierarchyGroupModel {
  homogeneousGroupId: string;
  hierarchyId: string;
  endDate: Date;
  startDate: Date;


  constructor(params: IHierarchyGroupModel) {
    this.homogeneousGroupId = params.homogeneousGroupId
    this.hierarchyId = params.hierarchyId
    this.endDate = params.endDate
    this.startDate = params.startDate
  }
}
