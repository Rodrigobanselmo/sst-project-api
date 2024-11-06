import { HierarchyTypeEnum } from "@/@v2/shared/domain/enum/company/hierarchy-type.enum";
import { CharacterizationTypeEnum } from "@/@v2/shared/domain/enum/security/characterization-type.enum";
import { ActionPlanStatusEnum } from "../../enums/action-plan-status.enum";
import { RiskTypeEnum } from "@/@v2/shared/domain/enum/security/risk-type.enum";
import { RecommendationTypeEnum } from "@/@v2/shared/domain/enum/security/recommendation-type.enum";
import { OriginTypeEnum } from "../../../../shared/domain/enum/security/origin-type.enum";
import { IRiskLevelValues } from "@/@v2/shared/domain/types/security/risk-level-values.type";
import { HomoTypeEnum } from "@/@v2/shared/domain/enum/security/homo-type.enum";
import { getOriginHomogeneousGroup } from "@/@v2/shared/domain/functions/security/get-origin-homogeneous-group.func";

export type IActionPlanBrowseResultModel = {
    uuid: { riskDataId: string; recommendationId: string; };
    createdAt: Date;
    updatedAt: Date | null;
    startDate: Date | null;
    doneDate: Date | null;
    canceledDate: Date | null;
    validDate: Date | null;
    ocupationalRiskLevel: IRiskLevelValues | null;
    recommendation: { name: string; type: RecommendationTypeEnum }
    generateSource: { name: string; }[]
    risk: { name: string; type: RiskTypeEnum }
    homogeneousGroup: {
        name: string;
        type: HomoTypeEnum | null;
        characterization: { name: string; type: CharacterizationTypeEnum } | null;
        hierarchy: { name: string; type: HierarchyTypeEnum } | null;
    };
    status: ActionPlanStatusEnum;
    hierarchies: { name: string; type: HierarchyTypeEnum; }[];
}

export class ActionPlanBrowseResultModel {
    uuid: { riskDataId: string; recommendationId: string; };
    createdAt: Date;
    updatedAt: Date | null;
    startDate: Date | null;
    doneDate: Date | null;
    canceledDate: Date | null;
    validDate: Date | null;
    ocupationalRiskLevel: IRiskLevelValues | null;
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
        this.status = params.status;
        this.generateSource = params.generateSource.map(source => ({
            name: source.name
        }));
        this.recommendation = {
            name: params.recommendation.name,
            type: params.recommendation.type
        }
        this.risk = {
            name: params.risk.name,
            type: params.risk.type
        };
        this.hierarchies = params.hierarchies.map(hierarchy => ({
            name: hierarchy.name,
            type: hierarchy.type
        }))

        this.origin = getOriginHomogeneousGroup(params.homogeneousGroup)
    }
}