import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { CreateEmployeeHierarchyHistoryDto, FindEmployeeHierarchyHistoryDto, UpdateEmployeeHierarchyHistoryDto } from '../../dto/employee-hierarchy-history';
import { CreateEmployeeHierarchyHistoryService } from '../../services/employee/0-history/hierarchy/create/create.service';
import { DeleteEmployeeHierarchyHistoryService } from '../../services/employee/0-history/hierarchy/delete/delete.service';
import { FindEmployeeHierarchyHistoryService } from '../../services/employee/0-history/hierarchy/find/find.service';
import { UpdateEmployeeHierarchyHistoryService } from '../../services/employee/0-history/hierarchy/update/update.service';
export declare class EmployeeHierarchyHistoryController {
    private readonly createEmployeeHierarchyHistoryService;
    private readonly updateEmployeeHierarchyHistoryService;
    private readonly findEmployeeHierarchyHistoryService;
    private readonly deleteEmployeeHierarchyHistoryService;
    constructor(createEmployeeHierarchyHistoryService: CreateEmployeeHierarchyHistoryService, updateEmployeeHierarchyHistoryService: UpdateEmployeeHierarchyHistoryService, findEmployeeHierarchyHistoryService: FindEmployeeHierarchyHistoryService, deleteEmployeeHierarchyHistoryService: DeleteEmployeeHierarchyHistoryService);
    find(userPayloadDto: UserPayloadDto, query: FindEmployeeHierarchyHistoryDto): Promise<{
        data: import("../../entities/employee-hierarchy-history.entity").EmployeeHierarchyHistoryEntity[];
        count: number;
    }>;
    create(upsertAccessGroupDto: CreateEmployeeHierarchyHistoryDto, userPayloadDto: UserPayloadDto): Promise<import("../../entities/employee-hierarchy-history.entity").EmployeeHierarchyHistoryEntity>;
    update(upsertAccessGroupDto: UpdateEmployeeHierarchyHistoryDto, userPayloadDto: UserPayloadDto, id: number): Promise<import("../../entities/employee-hierarchy-history.entity").EmployeeHierarchyHistoryEntity>;
    delete(userPayloadDto: UserPayloadDto, id: number, employeeId: number): Promise<import("../../entities/employee-hierarchy-history.entity").EmployeeHierarchyHistoryEntity>;
}
