import { RiskGroupDataRepository } from '../../../repositories/implementations/RiskGroupDataRepository';
export declare class FindAllByCompanyService {
    private readonly riskGroupDataRepository;
    constructor(riskGroupDataRepository: RiskGroupDataRepository);
    execute(companyId: string): Promise<import("../../../entities/riskGroupData.entity").RiskFactorGroupDataEntity[]>;
}
