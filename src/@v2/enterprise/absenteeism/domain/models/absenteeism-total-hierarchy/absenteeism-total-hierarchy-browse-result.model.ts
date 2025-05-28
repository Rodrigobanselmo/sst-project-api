export type IAbsenteeismTotalHierarchyModel = {
  id: string;
  name: string;
};

export type IAbsenteeismTotalHierarchyResultBrowseModel = {
  total: number;
  totalDays: number;
  averageDays: number;
  WORKSPACE?: IAbsenteeismTotalHierarchyModel;
  DIRECTORY?: IAbsenteeismTotalHierarchyModel;
  MANAGEMENT?: IAbsenteeismTotalHierarchyModel;
  SECTOR?: IAbsenteeismTotalHierarchyModel;
  SUB_SECTOR?: IAbsenteeismTotalHierarchyModel;
  OFFICE?: IAbsenteeismTotalHierarchyModel;
  SUB_OFFICE?: IAbsenteeismTotalHierarchyModel;
};

export class AbsenteeismTotalHierarchyResultBrowseModel {
  total: number;
  totalDays: number;
  averageDays: number;

  WORKSPACE?: IAbsenteeismTotalHierarchyModel;
  DIRECTORY?: IAbsenteeismTotalHierarchyModel;
  MANAGEMENT?: IAbsenteeismTotalHierarchyModel;
  SECTOR?: IAbsenteeismTotalHierarchyModel;
  SUB_SECTOR?: IAbsenteeismTotalHierarchyModel;
  OFFICE?: IAbsenteeismTotalHierarchyModel;
  SUB_OFFICE?: IAbsenteeismTotalHierarchyModel;

  constructor(params: IAbsenteeismTotalHierarchyResultBrowseModel) {
    this.total = params.total;
    this.totalDays = params.totalDays;
    this.averageDays = params.averageDays;

    this.WORKSPACE = params.WORKSPACE;
    this.DIRECTORY = params.DIRECTORY;
    this.MANAGEMENT = params.MANAGEMENT;
    this.SECTOR = params.SECTOR;
    this.SUB_SECTOR = params.SUB_SECTOR;
    this.OFFICE = params.OFFICE;
    this.SUB_OFFICE = params.SUB_OFFICE;
  }
}
