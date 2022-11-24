import { UserPayloadDto } from '../../../../../../../shared/dto/user-payload.dto';
import { EmployeeRepository } from '../../../../../repositories/implementations/EmployeeRepository';
import { UpdateEmployeeExamHistoryDto } from './../../../../../dto/employee-exam-history';
import { EmployeeExamsHistoryRepository } from './../../../../../repositories/implementations/EmployeeExamsHistoryRepository';
export declare class UpdateEmployeeExamHistoryService {
    private readonly employeeExamHistoryRepository;
    private readonly employeeRepository;
    constructor(employeeExamHistoryRepository: EmployeeExamsHistoryRepository, employeeRepository: EmployeeRepository);
    execute(dataDto: UpdateEmployeeExamHistoryDto, user: UserPayloadDto): Promise<import("../../../../../entities/employee-exam-history.entity").EmployeeExamsHistoryEntity>;
}
