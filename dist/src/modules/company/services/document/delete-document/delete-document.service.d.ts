import { AmazonStorageProvider } from './../../../../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { DocumentRepository } from '../../../repositories/implementations/DocumentRepository';
export declare class DeleteDocumentService {
    private readonly documentRepository;
    private readonly amazonStorageProvider;
    constructor(documentRepository: DocumentRepository, amazonStorageProvider: AmazonStorageProvider);
    execute(id: number, user: UserPayloadDto): Promise<import("../../../entities/document.entity").DocumentEntity>;
}
