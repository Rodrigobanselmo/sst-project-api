/// <reference types="node" />
import { RiskDocumentRepository } from '../../../../checklist/repositories/implementations/RiskDocumentRepository';
import { AmazonStorageProvider } from '../../../../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
export declare class PgrDownloadService {
    private readonly amazonStorageProvider;
    private readonly riskDocumentRepository;
    constructor(amazonStorageProvider: AmazonStorageProvider, riskDocumentRepository: RiskDocumentRepository);
    execute(userPayloadDto: UserPayloadDto, docId: string): Promise<{
        fileStream: import("stream").Readable;
        fileKey: string;
    }>;
}
