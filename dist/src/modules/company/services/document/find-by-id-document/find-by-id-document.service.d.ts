import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { DocumentRepository } from '../../../repositories/implementations/DocumentRepository';
export declare class FindByIdDocumentService {
    private readonly documentRepository;
    constructor(documentRepository: DocumentRepository);
    execute(id: number, user: UserPayloadDto): Promise<import("../../../entities/document.entity").DocumentEntity>;
}
