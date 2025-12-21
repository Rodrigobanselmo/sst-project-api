import { Hierarchy, HierarchyOnHomogeneous } from '@prisma/client';
import { HierarchyModel } from '../../domain/models/hierarchy.model';
import { EmployeeModel } from '../../domain/models/employee.model';
import { HierarchyTypeEnum } from '@/@v2/shared/domain/enum/company/hierarchy-type.enum';
import { HierarchyGroupModel } from '../../domain/models/hierarchy-groups.model';

export type IHierarchyMapper = Hierarchy & {
  employees: { id: number }[];
  subOfficeEmployees: { id: number }[];
  hierarchyOnHomogeneous: HierarchyOnHomogeneous[];
};

export class HierarchyMapper {
  static toModel(data: IHierarchyMapper): HierarchyModel {
    return new HierarchyModel({
      id: data.id,
      description: data.description,
      name: data.name,
      type: HierarchyTypeEnum[data.type],
      groups: data.hierarchyOnHomogeneous.map(
        (hierarchyGroup) =>
          new HierarchyGroupModel({
            endDate: hierarchyGroup.endDate,
            hierarchyId: hierarchyGroup.hierarchyId,
            homogeneousGroupId: hierarchyGroup.homogeneousGroupId,
            startDate: hierarchyGroup.startDate,
          }),
      ),
      parentId: data.parentId,
      realDescription: data.realDescription,
      subOfficeEmployees: data.subOfficeEmployees.map(
        (employee) =>
          new EmployeeModel({
            id: employee.id,
          }),
      ),
      employees: data.employees.map(
        (employee) =>
          new EmployeeModel({
            id: employee.id,
          }),
      ),
      metadata: data.metadata as Record<string, unknown> | null,
    });
  }

  static toModels(data: IHierarchyMapper[]): HierarchyModel[] {
    return data.map((hierarchy) => this.toModel(hierarchy));
  }
}
