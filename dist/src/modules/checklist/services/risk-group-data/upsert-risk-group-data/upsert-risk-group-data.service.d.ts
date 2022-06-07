import { UpsertRiskGroupDataDto } from '../../../dto/risk-group-data.dto';
import { RiskGroupDataRepository } from '../../../repositories/implementations/RiskGroupDataRepository';
export declare class UpsertRiskGroupDataService {
    private readonly riskGroupDataRepository;
    constructor(riskGroupDataRepository: RiskGroupDataRepository);
    execute(upsertRiskDataDto: UpsertRiskGroupDataDto): Promise<import("../../../entities/riskGroupData.entity").RiskFactorGroupDataEntity>;
}
