import { UserPayloadDto } from './../../../../../../../shared/dto/user-payload.dto';
import { FindEmployeeHierarchyHistoryDto } from './../../../../../dto/employee-hierarchy-history';
import { EmployeeHierarchyHistoryRepository } from './../../../../../repositories/implementations/EmployeeHierarchyHistoryRepository';
export declare class FindEmployeeHierarchyHistoryService {
    private readonly employeeHierarchyHistoryRepository;
    constructor(employeeHierarchyHistoryRepository: EmployeeHierarchyHistoryRepository);
    execute({ skip, take, ...query }: FindEmployeeHierarchyHistoryDto, user: UserPayloadDto): Promise<{
        data: import("../../../../../entities/employee-hierarchy-history.entity").EmployeeHierarchyHistoryEntity[];
        count: number;
    }>;
}
