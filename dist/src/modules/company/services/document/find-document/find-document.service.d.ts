import { FindDocumentDto } from '../../../dto/document.dto';
import { DocumentRepository } from '../../../repositories/implementations/DocumentRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
export declare class FindDocumentService {
    private readonly documentRepository;
    constructor(documentRepository: DocumentRepository);
    execute({ skip, take, ...query }: FindDocumentDto, user: UserPayloadDto): Promise<{
        data: import("../../../entities/document.entity").DocumentEntity[];
        count: number;
    }>;
}
