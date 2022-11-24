import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { UpsertRiskGroupDataDto } from '../../dto/risk-group-data.dto';
import { FindAllByCompanyService } from '../../services/risk-group-data/find-by-company/find-by-company.service';
import { FindByIdService } from '../../services/risk-group-data/find-by-id/find-by-id.service';
import { UpsertRiskGroupDataService } from '../../services/risk-group-data/upsert-risk-group-data/upsert-risk-group-data.service';
export declare class RiskGroupDataController {
    private readonly upsertRiskGroupDataService;
    private readonly findAllByCompanyService;
    private readonly findByIdService;
    constructor(upsertRiskGroupDataService: UpsertRiskGroupDataService, findAllByCompanyService: FindAllByCompanyService, findByIdService: FindByIdService);
    upsert(upsertRiskGroupDataDto: UpsertRiskGroupDataDto): Promise<import("../../entities/riskGroupData.entity").RiskFactorGroupDataEntity>;
    findAllAvailable(userPayloadDto: UserPayloadDto): Promise<import("../../entities/riskGroupData.entity").RiskFactorGroupDataEntity[]>;
    findById(id: string, userPayloadDto: UserPayloadDto): Promise<import("../../entities/riskGroupData.entity").RiskFactorGroupDataEntity>;
}
