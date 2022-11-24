import { RiskRepository } from '../../../repositories/implementations/RiskRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { FindRiskDto } from '../../../dto/risk.dto';
export declare class FindRisksByCompanyService {
    private readonly riskRepository;
    constructor(riskRepository: RiskRepository);
    execute({ skip, take, ...query }: FindRiskDto, user: UserPayloadDto): Promise<{
        data: import("../../../entities/risk.entity").RiskFactorsEntity[];
        count: number;
    }>;
}
