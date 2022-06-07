import { RiskDataRepository } from '../../../repositories/implementations/RiskDataRepository';
export declare class FindAllByGroupAndRiskService {
    private readonly riskDataRepository;
    constructor(riskDataRepository: RiskDataRepository);
    execute(riskId: string, groupId: string, companyId: string): Promise<import("../../../entities/riskData.entity").RiskFactorDataEntity[]>;
}
