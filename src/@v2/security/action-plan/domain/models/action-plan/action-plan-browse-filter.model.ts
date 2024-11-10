import { ActionPlanStatusEnum } from "../../enums/action-plan-status.enum";

export type IActionPlanBrowseFilterModel = {
    status: ActionPlanStatusEnum[]
    workspaces: { id: string; name: string; }[];

    // generateSources: ({ id: number; name: string; })[]
    // risks: ({ id: number; name: string; })[]
    // recommendations: ({ id: number; name: string; })[]
    // responsibles: ({ id: number; name: string; })[]
}

export class ActionPlanBrowseFilterModel {
    status: ActionPlanStatusEnum[]
    workspaces: { id: string; name: string; }[];

    // generateSources: ({ id: number; name: string; })[]
    // risks: ({ id: number; name: string; })[]
    // recommendations: ({ id: number; name: string; })[]
    // responsibles: ({ id: number; name: string; })[]

    constructor(params: IActionPlanBrowseFilterModel) {
        this.status = params.status;
        this.workspaces = params.workspaces.map(workspace => ({
            id: workspace.id,
            name: workspace.name
        }));

        // this.generateSources = params.generateSources;
        // this.risks = params.risks;
        // this.recommendations = params.recommendations;
        // this.responsibles = params.responsibles
    }
}