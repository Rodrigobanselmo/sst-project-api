import { UserPayloadDto } from '../../../../../../../shared/dto/user-payload.dto';
import { FindEmployeeExamHistoryDto } from '../../../../../dto/employee-exam-history';
import { EmployeeExamsHistoryRepository } from '../../../../../repositories/implementations/EmployeeExamsHistoryRepository';
export declare class FindEmployeeExamHistoryService {
    private readonly employeeExamHistoryRepository;
    constructor(employeeExamHistoryRepository: EmployeeExamsHistoryRepository);
    execute({ skip, take, includeClinic, orderByCreation, ...query }: FindEmployeeExamHistoryDto, user: UserPayloadDto): Promise<{
        data: import("../../../../../entities/employee-exam-history.entity").EmployeeExamsHistoryEntity[];
        count: number;
    }>;
}
