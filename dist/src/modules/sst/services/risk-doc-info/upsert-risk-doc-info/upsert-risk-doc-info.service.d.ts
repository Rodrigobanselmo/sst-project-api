import { EmployeePPPHistoryRepository } from './../../../../company/repositories/implementations/EmployeePPPHistoryRepository';
import { RiskRepository } from '../../../repositories/implementations/RiskRepository';
import { RiskDocInfoEntity } from '../../../entities/riskDocInfo.entity';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { UpsertRiskDocInfoDto } from '../../../dto/risk-doc-info.dto';
import { RiskDocInfoRepository } from '../../../repositories/implementations/RiskDocInfoRepository';
export declare class UpsertRiskDocInfoService {
    private readonly riskDocInfoRepository;
    private readonly riskRepository;
    private readonly employeePPPHistoryRepository;
    constructor(riskDocInfoRepository: RiskDocInfoRepository, riskRepository: RiskRepository, employeePPPHistoryRepository: EmployeePPPHistoryRepository);
    execute(upsertRiskDataDto: UpsertRiskDocInfoDto, user: UserPayloadDto): Promise<import("../../../entities/risk.entity").RiskFactorsEntity | RiskDocInfoEntity>;
}
