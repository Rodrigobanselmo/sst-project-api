import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { DeleteManyRiskDataService } from '../../services/risk-data/delete-many-risk-data/delete-many-risk-data.service';
import { FindAllActionPlanService } from '../../services/risk-data/find-all-action-plan/find-all-action-plan.service';
import { FindAllByGroupAndRiskService } from '../../services/risk-data/find-by-group-risk/find-by-group-risk.service';
import { FindAllByHierarchyService } from '../../services/risk-data/find-by-hierarchy/find-by-hierarchy.service';
import { FindAllByHomogeneousGroupService } from '../../services/risk-data/find-by-homogeneous-group/find-by-homogeneous-group.service';
import { UpsertManyRiskDataService } from '../../services/risk-data/upsert-many-risk-data/upsert-many-risk-data.service';
import { UpsertRiskDataService } from '../../services/risk-data/upsert-risk-data/upsert-risk.service';
import { DeleteManyRiskDataDto, FindRiskDataDto, UpsertManyRiskDataDto, UpsertRiskDataDto } from '../../dto/risk-data.dto';
export declare class RiskDataController {
    private readonly upsertRiskDataService;
    private readonly upsertManyRiskDataService;
    private readonly findAllByGroupAndRiskService;
    private readonly findAllByHomogeneousGroupService;
    private readonly findAllByHierarchyService;
    private readonly deleteManyRiskDataService;
    private readonly findAllActionPlanService;
    constructor(upsertRiskDataService: UpsertRiskDataService, upsertManyRiskDataService: UpsertManyRiskDataService, findAllByGroupAndRiskService: FindAllByGroupAndRiskService, findAllByHomogeneousGroupService: FindAllByHomogeneousGroupService, findAllByHierarchyService: FindAllByHierarchyService, deleteManyRiskDataService: DeleteManyRiskDataService, findAllActionPlanService: FindAllActionPlanService);
    upsert(upsertRiskDataDto: UpsertRiskDataDto): Promise<string | import("../../entities/riskData.entity").RiskFactorDataEntity>;
    upsertMany(upsertRiskDataDto: UpsertManyRiskDataDto): Promise<import("../../entities/riskData.entity").RiskFactorDataEntity[][]>;
    findActionPlan(userPayloadDto: UserPayloadDto, groupId: string, workspaceId: string, query: FindRiskDataDto): Promise<{
        data: import("../../entities/riskData.entity").RiskFactorDataEntity[];
        count: number;
    }>;
    findAllAvailableByHomogenousGroup(userPayloadDto: UserPayloadDto, groupId: string, homogeneousGroupId: string): Promise<import("../../entities/riskData.entity").RiskFactorDataEntity[]>;
    findAllAvailableByHierarchy(userPayloadDto: UserPayloadDto, hierarchyId: string): Promise<import("../../entities/riskData.entity").RiskFactorDataEntity[]>;
    findAllAvailable(userPayloadDto: UserPayloadDto, riskId: string, groupId: string): Promise<import("../../entities/riskData.entity").RiskFactorDataEntity[]>;
    delete(upsertRiskDataDto: DeleteManyRiskDataDto, companyId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
