export type IHierarchyGroupModel = {
  homogeneousGroupId: string;
  endDate: Date;
  startDate: Date;
}

export class HierarchyGroupModel {
  homogeneousGroupId: string;
  endDate: Date;
  startDate: Date;


  constructor(params: IHierarchyGroupModel) {
    this.homogeneousGroupId = params.homogeneousGroupId
    this.endDate = params.endDate
    this.startDate = params.startDate
  }
}
