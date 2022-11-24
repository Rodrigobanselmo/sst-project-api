/// <reference types="multer" />
import { DocumentEntity } from './../../../entities/document.entity';
import { AmazonStorageProvider } from './../../../../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider';
import { UpdateDocumentDto } from '../../../dto/document.dto';
import { DocumentRepository } from '../../../repositories/implementations/DocumentRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
export declare class UpdateDocumentService {
    private readonly documentRepository;
    private readonly amazonStorageProvider;
    constructor(documentRepository: DocumentRepository, amazonStorageProvider: AmazonStorageProvider);
    execute(updateDto: UpdateDocumentDto, user: UserPayloadDto, file: Express.Multer.File): Promise<DocumentEntity>;
    private upload;
}
