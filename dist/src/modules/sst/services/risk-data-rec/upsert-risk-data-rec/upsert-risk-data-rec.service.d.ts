import { RiskDataRecRepository } from '../../../repositories/implementations/RiskDataRecRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { UpsertRiskDataRecDto } from '../../../dto/risk-data-rec.dto';
export declare class UpsertRiskDataRecService {
    private readonly riskDataRecRepository;
    constructor(riskDataRecRepository: RiskDataRecRepository);
    execute(upsertRiskDataDto: UpsertRiskDataRecDto, user: UserPayloadDto): Promise<import("../../../entities/riskDataRec.entity").RiskDataRecEntity>;
}
