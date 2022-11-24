import { UserPayloadDto } from '../../../../../../../shared/dto/user-payload.dto';
import { AmazonStorageProvider } from './../../../../../../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider';
import { EmployeeExamsHistoryRepository } from './../../../../../repositories/implementations/EmployeeExamsHistoryRepository';
export declare class DeleteEmployeeExamHistoryService {
    private readonly amazonStorageProvider;
    private readonly employeeExamHistoryRepository;
    constructor(amazonStorageProvider: AmazonStorageProvider, employeeExamHistoryRepository: EmployeeExamsHistoryRepository);
    execute(id: number, employeeId: number, user: UserPayloadDto): Promise<import("../../../../../entities/employee-exam-history.entity").EmployeeExamsHistoryEntity>;
}
