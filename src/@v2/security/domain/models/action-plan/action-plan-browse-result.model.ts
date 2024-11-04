import { HierarchyTypeEnum } from "@/@v2/shared/domain/enum/company/hierarchy-type.enum";
import { CharacterizationTypeEnum } from "@/@v2/shared/domain/enum/security/characterization-type.enum";
import { ActionPlanStatusEnum } from "../../enums/action-plan-status.enum";
import { RiskTypeEnum } from "@/@v2/shared/domain/enum/security/risk-type.enum";
import { RecommendationTypeEnum } from "@/@v2/shared/domain/enum/security/recommendation-type.enum";
import { OriginTypeEnum } from "../../enums/origin-type.enum";
import { IRiskLevelValues } from "@/@v2/shared/domain/types/security/risk-level-values.type";

export type IActionPlanBrowseResultModel = {
    uuid: { riskDataId: string; recommendationId: string; };
    createdAt: Date;
    updatedAt: Date;
    startDate: Date;
    doneDate: Date;
    canceledDate: Date;
    validDate: Date;
    ocupationalRiskLevel: IRiskLevelValues;
    recommendation: { name: string; type: RecommendationTypeEnum }
    generateSource: { name: string; }[]
    risk: { name: string; type: RiskTypeEnum }
    origin: { name: string; type: OriginTypeEnum }
    status: ActionPlanStatusEnum;
    hierarchies: { name: string; type: HierarchyTypeEnum; }[];
}

export class ActionPlanBrowseResultModel {
    uuid: { riskDataId: string; recommendationId: string; };
    createdAt: Date;
    updatedAt: Date;
    validDate: Date;
    startDate: Date;
    doneDate: Date;
    canceledDate: Date;
    ocupationalRiskLevel: IRiskLevelValues;
    recommendation: { name: string; type: RecommendationTypeEnum }
    generateSource: { name: string; }[]
    risk: { name: string; type: RiskTypeEnum }
    origin: { name: string; type: OriginTypeEnum }
    status: ActionPlanStatusEnum;
    hierarchies: { name: string; type: HierarchyTypeEnum; }[];

    constructor(params: IActionPlanBrowseResultModel) {
        this.uuid = {
            recommendationId: params.uuid.recommendationId,
            riskDataId: params.uuid.riskDataId
        };
        this.createdAt = params.createdAt;
        this.updatedAt = params.updatedAt;
        this.validDate = params.validDate;
        this.startDate = params.startDate;
        this.doneDate = params.doneDate;
        this.canceledDate = params.canceledDate;
        this.ocupationalRiskLevel = params.ocupationalRiskLevel;
        this.recommendation = params.recommendation;
        this.generateSource = params.generateSource;
        this.risk = params.risk;
        this.origin = params.origin;
        this.status = params.status;
        this.hierarchies = params.hierarchies;
    }
}