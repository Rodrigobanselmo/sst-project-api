import { RiskRepository } from '../../../../../modules/checklist/repositories/implementations/RiskRepository';
export declare class FindAllAvailableRiskService {
    private readonly riskRepository;
    constructor(riskRepository: RiskRepository);
    execute(companyId: string): Promise<import("../../../entities/risk.entity").RiskFactorsEntity[]>;
}
