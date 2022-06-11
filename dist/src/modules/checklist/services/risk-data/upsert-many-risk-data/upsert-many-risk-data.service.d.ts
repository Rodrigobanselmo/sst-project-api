import { UpsertManyRiskDataDto } from '../../../dto/risk-data.dto';
import { RiskDataRepository } from '../../../repositories/implementations/RiskDataRepository';
export declare class UpsertManyRiskDataService {
    private readonly riskDataRepository;
    constructor(riskDataRepository: RiskDataRepository);
    execute(upsertRiskDataDto: UpsertManyRiskDataDto): Promise<import("../../../entities/riskData.entity").RiskFactorDataEntity[][]>;
}
