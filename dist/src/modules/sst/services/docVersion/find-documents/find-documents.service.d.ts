import { FindDocVersionDto } from '../../../dto/doc-version.dto';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { RiskDocumentRepository } from '../../../repositories/implementations/RiskDocumentRepository';
export declare class FindDocumentsService {
    private readonly riskDocumentRepository;
    constructor(riskDocumentRepository: RiskDocumentRepository);
    execute({ skip, take, ...query }: FindDocVersionDto, user: UserPayloadDto): Promise<{
        data: import("../../../entities/riskDocument.entity").RiskDocumentEntity[];
        count: number;
    }>;
}
