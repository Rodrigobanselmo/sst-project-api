/// <reference types="node" />
import { UserPayloadDto } from '../../../../../../../shared/dto/user-payload.dto';
import { AmazonStorageProvider } from '../../../../../../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider';
import { EmployeeExamsHistoryRepository } from './../../../../../repositories/implementations/EmployeeExamsHistoryRepository';
export declare class DownloadExamService {
    private readonly employeeExamHistoryRepository;
    private readonly amazonStorageProvider;
    constructor(employeeExamHistoryRepository: EmployeeExamsHistoryRepository, amazonStorageProvider: AmazonStorageProvider);
    execute(id: number, user: UserPayloadDto): Promise<{
        fileStream: import("stream").Readable;
        fileKey: string;
    }>;
}
