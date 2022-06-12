import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { DeleteManyRiskDataService } from '../../services/risk-data/delete-many-risk-data/delete-many-risk-data.service';
import { FindAllByGroupAndRiskService } from '../../services/risk-data/find-by-group-risk/find-by-group-risk.service';
import { UpsertManyRiskDataService } from '../../services/risk-data/upsert-many-risk-data/upsert-many-risk-data.service';
import { UpsertRiskDataService } from '../../services/risk-data/upsert-risk-data/upsert-risk.service';
import { DeleteManyRiskDataDto, UpsertManyRiskDataDto, UpsertRiskDataDto } from './../../dto/risk-data.dto';
export declare class RiskDataController {
    private readonly upsertRiskDataService;
    private readonly upsertManyRiskDataService;
    private readonly findAllByGroupAndRiskService;
    private readonly deleteManyRiskDataService;
    constructor(upsertRiskDataService: UpsertRiskDataService, upsertManyRiskDataService: UpsertManyRiskDataService, findAllByGroupAndRiskService: FindAllByGroupAndRiskService, deleteManyRiskDataService: DeleteManyRiskDataService);
    upsert(upsertRiskDataDto: UpsertRiskDataDto): Promise<string | import("../../entities/riskData.entity").RiskFactorDataEntity>;
    upsertMany(upsertRiskDataDto: UpsertManyRiskDataDto): Promise<import("../../entities/riskData.entity").RiskFactorDataEntity[][]>;
    findAllAvailable(userPayloadDto: UserPayloadDto, riskId: string, groupId: string): Promise<import("../../entities/riskData.entity").RiskFactorDataEntity[]>;
    deleteMany(upsertRiskDataDto: DeleteManyRiskDataDto, groupId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
