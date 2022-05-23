import { RiskGroupDataRepository } from '../../../repositories/implementations/RiskGroupDataRepository';
export declare class FindByIdService {
    private readonly riskGroupDataRepository;
    constructor(riskGroupDataRepository: RiskGroupDataRepository);
    execute(id: string, companyId: string): Promise<import("../../../entities/riskGroupData.entity").RiskFactorGroupDataEntity>;
}
