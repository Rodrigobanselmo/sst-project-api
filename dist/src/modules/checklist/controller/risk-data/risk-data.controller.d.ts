import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { FindAllByGroupAndRiskService } from '../../services/risk-data/find-by-group-risk/find-by-group-risk.service';
import { UpsertManyRiskDataService } from '../../services/risk-data/upsert-many-risk-data/upsert-many-risk-data.service';
import { UpsertRiskDataService } from '../../services/risk-data/upsert-risk-data/upsert-risk.service';
import { UpsertManyRiskDataDto, UpsertRiskDataDto } from './../../dto/risk-data.dto';
export declare class RiskDataController {
    private readonly upsertRiskDataService;
    private readonly upsertManyRiskDataService;
    private readonly findAllByGroupAndRiskService;
    constructor(upsertRiskDataService: UpsertRiskDataService, upsertManyRiskDataService: UpsertManyRiskDataService, findAllByGroupAndRiskService: FindAllByGroupAndRiskService);
    upsert(upsertRiskDataDto: UpsertRiskDataDto): Promise<string | import("../../entities/riskData.entity").RiskFactorDataEntity>;
    upsertMany(upsertRiskDataDto: UpsertManyRiskDataDto): Promise<import("../../entities/riskData.entity").RiskFactorDataEntity[][]>;
    findAllAvailable(userPayloadDto: UserPayloadDto, riskId: string, groupId: string): Promise<import("../../entities/riskData.entity").RiskFactorDataEntity[]>;
}
