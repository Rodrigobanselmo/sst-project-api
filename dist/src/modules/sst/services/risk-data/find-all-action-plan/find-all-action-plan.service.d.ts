import { FindRiskDataDto } from '../../../dto/risk-data.dto';
import { RiskDataRepository } from '../../../repositories/implementations/RiskDataRepository';
export declare class FindAllActionPlanService {
    private readonly riskDataRepository;
    constructor(riskDataRepository: RiskDataRepository);
    execute(groupId: string, workspaceId: string, companyId: string, { skip, take, ...query }: FindRiskDataDto): Promise<{
        data: import("../../../entities/riskData.entity").RiskFactorDataEntity[];
        count: number;
    }>;
}
