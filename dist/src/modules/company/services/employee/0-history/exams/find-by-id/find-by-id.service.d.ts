import { UserPayloadDto } from '../../../../../../../shared/dto/user-payload.dto';
import { EmployeeExamsHistoryRepository } from '../../../../../repositories/implementations/EmployeeExamsHistoryRepository';
export declare class FindByIdEmployeeExamHistoryService {
    private readonly employeeExamHistoryRepository;
    constructor(employeeExamHistoryRepository: EmployeeExamsHistoryRepository);
    execute(id: number, user: UserPayloadDto): Promise<import("../../../../../entities/employee-exam-history.entity").EmployeeExamsHistoryEntity>;
}
