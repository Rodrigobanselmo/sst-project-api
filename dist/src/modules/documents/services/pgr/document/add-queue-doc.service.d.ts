import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { RiskDocumentRepository } from '../../../../sst/repositories/implementations/RiskDocumentRepository';
import { UpsertDocumentDto } from '../../../dto/pgr.dto';
export declare class AddQueueDocumentService {
    private readonly riskDocumentRepository;
    private readonly sqs;
    private readonly queueUrl;
    constructor(riskDocumentRepository: RiskDocumentRepository);
    execute(upsertPgrDto: UpsertDocumentDto, userPayloadDto: UserPayloadDto): Promise<import("../../../../sst/entities/riskDocument.entity").RiskDocumentEntity>;
}
