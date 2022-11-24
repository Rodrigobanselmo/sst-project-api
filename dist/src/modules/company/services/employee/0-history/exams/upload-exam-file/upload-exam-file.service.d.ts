/// <reference types="multer" />
import { UpdateFileExamDto } from './../../../../../dto/employee-exam-history';
import { EmployeeExamsHistoryEntity } from '../../../../../entities/employee-exam-history.entity';
import { UserPayloadDto } from '../../../../../../../shared/dto/user-payload.dto';
import { AmazonStorageProvider } from '../../../../../../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider';
import { EmployeeExamsHistoryRepository } from '../../../../../repositories/implementations/EmployeeExamsHistoryRepository';
export declare class UploadExamFileService {
    private readonly employeeExamHistoryRepository;
    private readonly amazonStorageProvider;
    constructor(employeeExamHistoryRepository: EmployeeExamsHistoryRepository, amazonStorageProvider: AmazonStorageProvider);
    execute({ ids }: UpdateFileExamDto, user: UserPayloadDto, file: Express.Multer.File): Promise<EmployeeExamsHistoryEntity[]>;
    private upload;
}
