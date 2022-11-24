import { UserPayloadDto } from '../../../../../../../shared/dto/user-payload.dto';
import { FindClinicEmployeeExamHistoryDto } from '../../../../../dto/employee-exam-history';
import { EmployeeExamsHistoryRepository } from '../../../../../repositories/implementations/EmployeeExamsHistoryRepository';
import { EmployeeRepository } from './../../../../../repositories/implementations/EmployeeRepository';
export declare class FindClinicScheduleEmployeeExamHistoryService {
    private readonly employeeExamHistoryRepository;
    private readonly employeeRepository;
    constructor(employeeExamHistoryRepository: EmployeeExamsHistoryRepository, employeeRepository: EmployeeRepository);
    execute(query: FindClinicEmployeeExamHistoryDto, user: UserPayloadDto): Promise<import("../../../../../entities/employee.entity").EmployeeEntity[]>;
}
