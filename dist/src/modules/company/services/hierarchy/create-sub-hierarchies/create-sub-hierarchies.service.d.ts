import { EmployeeRepository } from './../../../repositories/implementations/EmployeeRepository';
import { HierarchyEnum } from '@prisma/client';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { CreateSubHierarchyDto } from '../../../dto/hierarchy';
import { HierarchyRepository } from '../../../repositories/implementations/HierarchyRepository';
export declare class CreateSubHierarchyService {
    private readonly hierarchyRepository;
    private readonly employeeRepository;
    constructor(hierarchyRepository: HierarchyRepository, employeeRepository: EmployeeRepository);
    execute(hierarchy: CreateSubHierarchyDto, user: UserPayloadDto): Promise<{
        workspaceIds: string[];
        id: string;
        name: string;
        description: string;
        realDescription: string;
        status: import(".prisma/client").StatusEnum;
        companyId: string;
        created_at: Date;
        type: HierarchyEnum;
        parentId: string;
        workspaces?: import("../../../entities/workspace.entity").WorkspaceEntity[];
        hierarchyOnHomogeneous?: import("../../../entities/homoGroup.entity").HierarchyOnHomogeneousEntity[];
        homogeneousGroups?: import("../../../entities/homoGroup.entity").HomoGroupEntity[];
        employees?: import("../../../entities/employee.entity").EmployeeEntity[];
        subOfficeEmployees?: import("../../../entities/employee.entity").EmployeeEntity[];
        parent?: import(".prisma/client").Hierarchy;
        parents?: import("../../../entities/hierarchy.entity").HierarchyEntity[];
        children?: import(".prisma/client").Hierarchy[];
        workspaceId?: string;
        employeesCount?: number;
        deletedAt: Date;
        subHierarchyHistory?: import("../../../entities/employee-hierarchy-history.entity").EmployeeHierarchyHistoryEntity[];
        hierarchyHistory?: import("../../../entities/employee-hierarchy-history.entity").EmployeeHierarchyHistoryEntity[];
        refName: string;
    }>;
}
