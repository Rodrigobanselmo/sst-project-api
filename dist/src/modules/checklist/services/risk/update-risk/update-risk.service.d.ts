import { UpdateRiskDto } from '../../../../../modules/checklist/dto/risk.dto';
import { RiskRepository } from '../../../../../modules/checklist/repositories/implementations/RiskRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
export declare class UpdateRiskService {
    private readonly riskRepository;
    constructor(riskRepository: RiskRepository);
    execute(id: string, updateRiskDto: UpdateRiskDto, user: UserPayloadDto): Promise<import("../../../entities/risk.entity").RiskFactorsEntity>;
}
