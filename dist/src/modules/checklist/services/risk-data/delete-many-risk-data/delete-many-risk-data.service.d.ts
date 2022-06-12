import { DeleteManyRiskDataDto } from '../../../../../modules/checklist/dto/risk-data.dto';
import { RiskDataRepository } from '../../../repositories/implementations/RiskDataRepository';
export declare class DeleteManyRiskDataService {
    private readonly riskDataRepository;
    constructor(riskDataRepository: RiskDataRepository);
    execute(upsertRiskDataDto: DeleteManyRiskDataDto, groupId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
