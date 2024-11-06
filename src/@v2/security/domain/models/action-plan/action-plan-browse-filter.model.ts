import { OriginTypeEnum } from "../../../../shared/domain/enum/security/origin-type.enum";

export type IActionPlanBrowseFilterModel = {
    generateSources: ({ id: number; name: string; })[]
    risks: ({ id: number; name: string; })[]
    recommendations: ({ id: number; name: string; })[]
    responsibles: ({ id: number; name: string; })[]
    status: ({ id: number; name: string; })[]
    workspaces: { id: string; name: string; }[];
    type: OriginTypeEnum[]
}

export class ActionPlanBrowseFilterModel {
    generateSources: ({ id: number; name: string; })[]
    risks: ({ id: number; name: string; })[]
    recommendations: ({ id: number; name: string; })[]
    responsibles: ({ id: number; name: string; })[]
    status: ({ id: number; name: string; })[]
    type: OriginTypeEnum[]

    constructor(params: IActionPlanBrowseFilterModel) {
        this.generateSources = params.generateSources;
        this.risks = params.risks;
        this.recommendations = params.recommendations;
        this.responsibles = params.responsibles
        this.status = params.status;
        this.type = params.type;
    }
}