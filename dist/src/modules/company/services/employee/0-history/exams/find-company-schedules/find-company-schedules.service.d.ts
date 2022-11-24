import { UserPayloadDto } from '../../../../../../../shared/dto/user-payload.dto';
import { FindCompanyEmployeeExamHistoryDto } from '../../../../../dto/employee-exam-history';
import { EmployeeExamsHistoryRepository } from '../../../../../repositories/implementations/EmployeeExamsHistoryRepository';
import { EmployeeRepository } from '../../../../../repositories/implementations/EmployeeRepository';
export declare class FindCompanyScheduleEmployeeExamHistoryService {
    private readonly employeeExamHistoryRepository;
    private readonly employeeRepository;
    constructor(employeeExamHistoryRepository: EmployeeExamsHistoryRepository, employeeRepository: EmployeeRepository);
    execute({ skip, take, ...query }: FindCompanyEmployeeExamHistoryDto, user: UserPayloadDto): Promise<{
        data: import("../../../../../entities/employee-exam-history.entity").EmployeeExamsHistoryEntity[];
        count: number;
    }>;
}
