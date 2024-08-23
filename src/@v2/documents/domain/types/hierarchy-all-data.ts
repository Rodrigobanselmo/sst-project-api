import { HierarchyTypeEnum } from "@/@v2/shared/domain/enum/company/hierarchy-type.enum";
import { HomogeneousGroupModel } from "../models/homogeneous-group.model";

export interface HierarchyAllData {
  org: {
    type: string;
    typeEnum: HierarchyTypeEnum;
    name: string;
    id: string;
    homogeneousGroups: HomogeneousGroupModel[];
  }[];
  allHomogeneousGroupIds: string[];
  workspace: string;
  descRh: string;
  descReal: string;
  employeesLength: number;
  subEmployeesLength: number;
}
