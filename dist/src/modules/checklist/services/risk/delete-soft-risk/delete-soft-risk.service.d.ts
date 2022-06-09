import { RiskRepository } from '../../../repositories/implementations/RiskRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
export declare class DeleteSoftRiskService {
    private readonly riskRepository;
    constructor(riskRepository: RiskRepository);
    execute(id: string, userPayloadDto: UserPayloadDto): Promise<import("../../../entities/risk.entity").RiskFactorsEntity>;
}
