import { UserPayloadDto } from '../../../../../../../shared/dto/user-payload.dto';
import { AmazonStorageProvider } from '../../../../../../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider';
import { EmployeeExamsHistoryRepository } from './../../../../../repositories/implementations/EmployeeExamsHistoryRepository';
export declare class DeleteExamFileService {
    private readonly employeeExamHistoryRepository;
    private readonly amazonStorageProvider;
    constructor(employeeExamHistoryRepository: EmployeeExamsHistoryRepository, amazonStorageProvider: AmazonStorageProvider);
    execute(id: number, user: UserPayloadDto): Promise<import("../../../../../entities/employee-exam-history.entity").EmployeeExamsHistoryEntity>;
}
