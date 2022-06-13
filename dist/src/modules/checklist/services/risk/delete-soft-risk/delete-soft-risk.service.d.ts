import { RiskRepository } from '../../../repositories/implementations/RiskRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { RiskFactorsEntity } from 'src/modules/checklist/entities/risk.entity';
export declare class DeleteSoftRiskService {
    private readonly riskRepository;
    constructor(riskRepository: RiskRepository);
    execute(id: string, userPayloadDto: UserPayloadDto): Promise<RiskFactorsEntity>;
}
