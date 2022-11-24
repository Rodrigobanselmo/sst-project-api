import { CreateRiskDto } from '../../../dto/risk.dto';
import { RiskRepository } from '../../../repositories/implementations/RiskRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
export declare class CreateRiskService {
    private readonly riskRepository;
    constructor(riskRepository: RiskRepository);
    execute(createRiskDto: CreateRiskDto, user: UserPayloadDto): Promise<import("../../../entities/risk.entity").RiskFactorsEntity>;
}
