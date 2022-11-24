import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { UpsertRiskDataRecDto } from '../../dto/risk-data-rec.dto';
import { UpsertRiskDataRecService } from '../../services/risk-data-rec/upsert-risk-data-rec/upsert-risk-data-rec.service';
export declare class RiskDataRecController {
    private readonly upsertRiskDataRecService;
    constructor(upsertRiskDataRecService: UpsertRiskDataRecService);
    upsert(upsertRiskDataDto: UpsertRiskDataRecDto, userPayloadDto: UserPayloadDto): Promise<import("../../entities/riskDataRec.entity").RiskDataRecEntity>;
}
