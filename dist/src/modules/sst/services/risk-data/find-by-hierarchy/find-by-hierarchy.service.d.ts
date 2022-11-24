import { RiskRepository } from '../../../repositories/implementations/RiskRepository';
import { RiskFactorDataEntity } from '../../../entities/riskData.entity';
export declare class FindAllByHierarchyService {
    private readonly riskRepository;
    constructor(riskRepository: RiskRepository);
    execute(hierarchyId: string, companyId: string): Promise<RiskFactorDataEntity[]>;
}
