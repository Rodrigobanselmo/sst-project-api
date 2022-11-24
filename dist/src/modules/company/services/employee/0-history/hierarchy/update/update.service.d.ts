import { EmployeePPPHistoryRepository } from './../../../../../repositories/implementations/EmployeePPPHistoryRepository';
import { UserPayloadDto } from '../../../../../../../shared/dto/user-payload.dto';
import { UpdateEmployeeHierarchyHistoryDto } from '../../../../../dto/employee-hierarchy-history';
import { EmployeeHierarchyHistoryRepository } from '../../../../../repositories/implementations/EmployeeHierarchyHistoryRepository';
import { EmployeeRepository } from '../../../../../repositories/implementations/EmployeeRepository';
import { CreateEmployeeHierarchyHistoryService } from '../create/create.service';
export declare class UpdateEmployeeHierarchyHistoryService {
    private readonly employeeHierarchyHistoryRepository;
    private readonly employeeRepository;
    private readonly employeePPPHistoryRepository;
    private readonly createEmployeeHierarchyHistoryService;
    constructor(employeeHierarchyHistoryRepository: EmployeeHierarchyHistoryRepository, employeeRepository: EmployeeRepository, employeePPPHistoryRepository: EmployeePPPHistoryRepository, createEmployeeHierarchyHistoryService: CreateEmployeeHierarchyHistoryService);
    execute(dataDto: UpdateEmployeeHierarchyHistoryDto, user: UserPayloadDto): Promise<import("../../../../../entities/employee-hierarchy-history.entity").EmployeeHierarchyHistoryEntity>;
}
