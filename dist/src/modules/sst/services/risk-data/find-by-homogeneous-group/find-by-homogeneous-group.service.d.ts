import { RiskDataRepository } from '../../../repositories/implementations/RiskDataRepository';
export declare class FindAllByHomogeneousGroupService {
    private readonly riskDataRepository;
    constructor(riskDataRepository: RiskDataRepository);
    execute(homogeneousGroupId: string, groupId: string, companyId: string): Promise<import("../../../entities/riskData.entity").RiskFactorDataEntity[]>;
}
