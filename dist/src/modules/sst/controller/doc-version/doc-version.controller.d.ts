import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { FindByIdDocumentsService } from '../../services/docVersion/find-by-id-documents/find-by-id-documents.service';
import { FindDocumentsService } from '../../services/docVersion/find-documents/find-documents.service';
import { FindDocVersionDto } from '../../dto/doc-version.dto';
export declare class DocumentPgrController {
    private readonly findDocumentsService;
    private readonly findByIdDocumentsService;
    constructor(findDocumentsService: FindDocumentsService, findByIdDocumentsService: FindByIdDocumentsService);
    find(userPayloadDto: UserPayloadDto, query: FindDocVersionDto): Promise<{
        data: import("../../entities/riskDocument.entity").RiskDocumentEntity[];
        count: number;
    }>;
    findById(id: string, userPayloadDto: UserPayloadDto): Promise<import("../../entities/riskDocument.entity").RiskDocumentEntity>;
}
