import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { FindAllByGroupAndRiskService } from '../../services/risk-data/find-by-group-risk/find-by-group-risk.service';
import { UpsertRiskDataService } from '../../services/risk-data/upsert-risk-data/upsert-risk.service';
import { UpsertRiskDataDto } from './../../dto/risk-data.dto';
export declare class RiskDataController {
    private readonly upsertRiskDataService;
    private readonly findAllByGroupAndRiskService;
    constructor(upsertRiskDataService: UpsertRiskDataService, findAllByGroupAndRiskService: FindAllByGroupAndRiskService);
    upsert(upsertRiskDataDto: UpsertRiskDataDto): Promise<import("../../entities/riskData.entity").RiskFactorDataEntity>;
    findAllAvailable(userPayloadDto: UserPayloadDto, riskId: string, groupId: string): Promise<import("../../entities/riskData.entity").RiskFactorDataEntity[]>;
}
