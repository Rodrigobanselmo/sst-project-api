import { HierarchyTypeEnum } from "@/@v2/shared/domain/enum/company/hierarchy-type.enum";
import { ActionPlanStatusEnum } from "../../enums/action-plan-status.enum";

type IHierarchyParent = {
    id: string;
    name: string;
}

export type IHierarchyParentsModel = {
    office?: IHierarchyParent;
    sector?: IHierarchyParent;
    subSector?: IHierarchyParent;
    management?: IHierarchyParent;
    directory?: IHierarchyParent
}

export type IHierarchyBrowseResultModel = IHierarchyParentsModel & {
    id: string;
    name: string;
    type: HierarchyTypeEnum;
}

export class HierarchyBrowseResultModel {
    id: string;
    name: string;
    type: HierarchyTypeEnum;

    office?: IHierarchyParent;
    sector?: IHierarchyParent;
    subSector?: IHierarchyParent;
    management?: IHierarchyParent;
    directory?: IHierarchyParent;

    constructor(params: IHierarchyBrowseResultModel) {
        this.id = params.id;
        this.name = params.name;
        this.type = params.type;

        this.office = params.office;
        this.sector = params.sector;
        this.subSector = params.subSector;
        this.management = params.management;
        this.directory = params.directory;
    }
}