import { HierarchyTypeEnum } from "@/@v2/shared/domain/enum/company/hierarchy-type.enum"
import { HierarchyGroupModel } from "./hierarchy-groups.model"
import { EmployeeModel } from "./employee.model"

export type IHierarchyModel = {
  id: string
  name: string
  parentId: string | null
  description: string
  type: HierarchyTypeEnum
  realDescription: string
  groups: HierarchyGroupModel[]
  employees: EmployeeModel[]
  subOfficeEmployees: EmployeeModel[]
}

export class HierarchyModel {
  id: string
  name: string
  parentId: string | null
  description: string
  type: HierarchyTypeEnum
  realDescription: string
  groups: HierarchyGroupModel[]
  employees: EmployeeModel[]
  subOfficeEmployees: EmployeeModel[]

  constructor(params: IHierarchyModel) {
    this.id = params.id
    this.name = params.name
    this.parentId = params.parentId
    this.description = params.description
    this.type = params.type
    this.realDescription = params.realDescription;
    this.groups = params.groups;
    this.employees = params.employees;
    this.subOfficeEmployees = params.subOfficeEmployees;
  }
}