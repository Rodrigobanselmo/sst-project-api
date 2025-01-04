import { HierarchyTypeEnum } from "@/@v2/shared/domain/enum/company/hierarchy-type.enum";

export type IHierarchyBrowseShortResultModel = {
    id: string;
    name: string;
    type: HierarchyTypeEnum;
}

export class HierarchyBrowseShortResultModel {
    id: string;
    name: string;
    type: HierarchyTypeEnum;

    constructor(params: IHierarchyBrowseShortResultModel) {
        this.id = params.id;
        this.name = params.name;
        this.type = params.type;
    }
}