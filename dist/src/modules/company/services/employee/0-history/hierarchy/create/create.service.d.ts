import { EmployeePPPHistoryRepository } from './../../../../../repositories/implementations/EmployeePPPHistoryRepository';
import { EmployeeEntity } from './../../../../../entities/employee.entity';
import { EmployeeHierarchyHistoryEntity } from './../../../../../entities/employee-hierarchy-history.entity';
import { UserPayloadDto } from '../../../../../../../shared/dto/user-payload.dto';
import { CreateEmployeeHierarchyHistoryDto } from '../../../../../dto/employee-hierarchy-history';
import { EmployeeHierarchyHistoryRepository } from '../../../../../repositories/implementations/EmployeeHierarchyHistoryRepository';
import { EmployeeRepository } from '../../../../../repositories/implementations/EmployeeRepository';
export declare class CreateEmployeeHierarchyHistoryService {
    private readonly employeeHierarchyHistoryRepository;
    private readonly employeeRepository;
    private readonly employeePPPHistoryRepository;
    constructor(employeeHierarchyHistoryRepository: EmployeeHierarchyHistoryRepository, employeeRepository: EmployeeRepository, employeePPPHistoryRepository: EmployeePPPHistoryRepository);
    execute(dataDto: CreateEmployeeHierarchyHistoryDto, user: UserPayloadDto): Promise<EmployeeHierarchyHistoryEntity>;
    check({ dataDto, foundEmployee }: {
        dataDto: Partial<CreateEmployeeHierarchyHistoryDto>;
        foundEmployee: EmployeeEntity;
    }): Promise<{
        hierarchyId: string;
        beforeHistory: EmployeeHierarchyHistoryEntity;
    }>;
}
