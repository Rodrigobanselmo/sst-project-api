import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { RiskRepository } from '../../../repositories/implementations/RiskRepository';
export declare class FindAllAvailableRiskService {
    private readonly riskRepository;
    constructor(riskRepository: RiskRepository);
    execute(userPayloadDto: UserPayloadDto): Promise<import("../../../entities/risk.entity").RiskFactorsEntity[]>;
}
