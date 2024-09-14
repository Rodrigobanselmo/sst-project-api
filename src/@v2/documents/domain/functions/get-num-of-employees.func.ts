import { HierarchyTypeEnum } from '@/@v2/shared/domain/enum/company/hierarchy-type.enum';
import { HierarchyModel } from "../models/hierarchy.model";

export function getNumOfEmployees(hierarchies: HierarchyModel[]) {
    return hierarchies.reduce((acc, hierarchy) => {
        if (hierarchy.type !== HierarchyTypeEnum.OFFICE) return acc
        return acc + hierarchy.employees.length
    }, 0)
}