import { HierarchyTypeEnum } from "@/@v2/shared/domain/enum/company/hierarchy-type.enum";
import { CharacterizationTypeEnum } from "@/@v2/shared/domain/enum/security/characterization-type.enum";
import { ActionPlanStatusEnum } from "../../enums/action-plan-status.enum";
import { RiskTypeEnum } from "@/@v2/shared/domain/enum/security/risk-type.enum";
import { RecommendationTypeEnum } from "@/@v2/shared/domain/enum/security/recommendation-type.enum";
import { IRiskLevelValues } from "@/@v2/shared/domain/types/security/risk-level-values.type";
import { HomoTypeEnum } from "@/@v2/shared/domain/enum/security/homo-type.enum";
import { getOriginHomogeneousGroup } from "@/@v2/shared/domain/functions/security/get-origin-homogeneous-group.func";
import { getValidDateActionPlan } from "@/@v2/shared/domain/functions/security/get-valid-date-action-plan.func";
import { OriginTypeEnum } from "@/@v2/shared/domain/enum/security/origin-type.enum";

export type IActionPlanBrowseResultModel = {
    uuid: { riskDataId: string; recommendationId: string; workspaceId: string };
    createdAt: Date;
    updatedAt: Date | null;
    startDate: Date | null;
    doneDate: Date | null;
    canceledDate: Date | null;
    ocupationalRisk: IRiskLevelValues | null;
    recommendation: { name: string; type: RecommendationTypeEnum }
    generateSources: { id: string; name: string; }[]
    status: ActionPlanStatusEnum;
    risk: { id: string; name: string; type: RiskTypeEnum }
    responsible: { id: string; name: string; } | null
    homogeneousGroup: {
        name: string;
        type: HomoTypeEnum | null;
        characterization: { name: string; type: CharacterizationTypeEnum } | null;
        hierarchy: { name: string; type: HierarchyTypeEnum } | null;
    };
    endDate: Date | null;
    validityStart: Date | null;
    periods: {
        monthsLevel_2: number;
        monthsLevel_3: number;
        monthsLevel_4: number;
        monthsLevel_5: number;
    }
}

export class ActionPlanBrowseResultModel {
    uuid: { riskDataId: string; recommendationId: string; workspaceId: string };
    createdAt: Date;
    updatedAt: Date | null;
    startDate: Date | null;
    doneDate: Date | null;
    canceledDate: Date | null;
    validDate: Date | null;
    ocupationalRisk: IRiskLevelValues | null;
    recommendation: { name: string; type: RecommendationTypeEnum }
    generateSources: { id: string; name: string; }[]
    risk: { id: string; name: string; type: RiskTypeEnum }
    origin: { name: string; type: OriginTypeEnum }
    status: ActionPlanStatusEnum;
    hierarchies: { name: string; type: HierarchyTypeEnum; }[];
    responsible: { id: string; name: string; } | null

    constructor(params: IActionPlanBrowseResultModel) {
        this.uuid = {
            recommendationId: params.uuid.recommendationId,
            riskDataId: params.uuid.riskDataId,
            workspaceId: params.uuid.workspaceId
        };
        this.createdAt = params.createdAt;
        this.updatedAt = params.updatedAt;
        this.startDate = params.startDate;
        this.doneDate = params.doneDate;
        this.canceledDate = params.canceledDate;
        this.ocupationalRisk = params.ocupationalRisk;
        this.status = params.status;
        this.generateSources = params.generateSources.map(source => ({
            id: source.id,
            name: source.name,
        }));
        this.recommendation = {
            name: params.recommendation.name,
            type: params.recommendation.type
        }
        this.risk = {
            id: params.risk.id,
            name: params.risk.name,
            type: params.risk.type
        };
        this.responsible = params.responsible ? {
            id: params.responsible.id,
            name: params.responsible.name,
        } : null

        this.validDate = getValidDateActionPlan({ ...params, level: params.ocupationalRisk });
        this.origin = getOriginHomogeneousGroup(params.homogeneousGroup)
    }
}