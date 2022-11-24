/// <reference types="node" />
import { RiskDocumentRepository } from '../../../../sst/repositories/implementations/RiskDocumentRepository';
import { AmazonStorageProvider } from '../../../../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
export declare class DownloadAttachmentsService {
    private readonly amazonStorageProvider;
    private readonly riskDocumentRepository;
    constructor(amazonStorageProvider: AmazonStorageProvider, riskDocumentRepository: RiskDocumentRepository);
    execute(userPayloadDto: UserPayloadDto, docId: string, attachmentId: string): Promise<{
        fileStream: import("stream").Readable;
        fileKey: string;
    }>;
}
