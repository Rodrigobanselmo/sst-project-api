import { UpsertRiskDataDto } from '../../../dto/risk-data.dto';
import { RiskDataRepository } from '../../../repositories/implementations/RiskDataRepository';
export declare class UpsertRiskDataService {
    private readonly riskDataRepository;
    constructor(riskDataRepository: RiskDataRepository);
    execute(upsertRiskDataDto: UpsertRiskDataDto): Promise<import("../../../entities/riskData.entity").RiskFactorDataEntity>;
}
