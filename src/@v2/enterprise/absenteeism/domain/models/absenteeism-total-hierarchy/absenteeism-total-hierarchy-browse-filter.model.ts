import { AbsenteeismHierarchyTypeEnum } from '../../enums/absenteeism-hierarchy-type';

export type IAbsenteeismTotalHierarchyFilterBrowseModel = {
  types: AbsenteeismHierarchyTypeEnum[];
};

export class AbsenteeismTotalHierarchyFilterBrowseModel {
  types: AbsenteeismHierarchyTypeEnum[];

  constructor(params: IAbsenteeismTotalHierarchyFilterBrowseModel) {
    this.types = params.types;
  }
}
