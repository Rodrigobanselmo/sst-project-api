/// <reference types="multer" />
import { AmazonStorageProvider } from './../../../../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { CreateDocumentDto } from '../../../dto/document.dto';
import { DocumentRepository } from '../../../repositories/implementations/DocumentRepository';
export declare class CreateDocumentService {
    private readonly documentRepository;
    private readonly amazonStorageProvider;
    constructor(documentRepository: DocumentRepository, amazonStorageProvider: AmazonStorageProvider);
    execute({ parentDocumentId, ...dto }: CreateDocumentDto, user: UserPayloadDto, file: Express.Multer.File): Promise<import("../../../entities/document.entity").DocumentEntity>;
    private upload;
}
