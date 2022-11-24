import { EmployeePPPHistoryRepository } from './../../../../../repositories/implementations/EmployeePPPHistoryRepository';
import { EmployeeHierarchyHistoryEntity } from './../../../../../entities/employee-hierarchy-history.entity';
import { EmployeeEntity } from './../../../../../entities/employee.entity';
import { UserPayloadDto } from '../../../../../../../shared/dto/user-payload.dto';
import { EmployeeHierarchyHistoryRepository } from './../../../../../repositories/implementations/EmployeeHierarchyHistoryRepository';
import { EmployeeRepository } from './../../../../../repositories/implementations/EmployeeRepository';
export declare class DeleteEmployeeHierarchyHistoryService {
    private readonly employeeHierarchyHistoryRepository;
    private readonly employeeRepository;
    private readonly employeePPPHistoryRepository;
    constructor(employeeHierarchyHistoryRepository: EmployeeHierarchyHistoryRepository, employeeRepository: EmployeeRepository, employeePPPHistoryRepository: EmployeePPPHistoryRepository);
    execute(id: number, employeeId: number, user: UserPayloadDto): Promise<EmployeeHierarchyHistoryEntity>;
    check({ foundEmployee, id }: {
        foundEmployee: EmployeeEntity;
        id: number;
    }): Promise<string>;
}
