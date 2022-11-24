import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { UpsertRiskDocInfoService } from '../../services/risk-doc-info/upsert-risk-doc-info/upsert-risk-doc-info.service';
import { UpsertRiskDocInfoDto } from '../../dto/risk-doc-info.dto';
export declare class RiskDocInfoController {
    private readonly upsertRiskDocInfoService;
    constructor(upsertRiskDocInfoService: UpsertRiskDocInfoService);
    upsert(upsertRiskDataDto: UpsertRiskDocInfoDto, userPayloadDto: UserPayloadDto): Promise<import("../../entities/risk.entity").RiskFactorsEntity | import("../../entities/riskDocInfo.entity").RiskDocInfoEntity>;
}
