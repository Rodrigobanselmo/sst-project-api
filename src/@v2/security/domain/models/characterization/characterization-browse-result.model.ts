import { HierarchyTypeEnum } from "@/@v2/shared/domain/enum/company/hierarchy-type.enum";
import { CharacterizationTypeEnum } from "@/@v2/shared/domain/enum/security/characterization-type.enum";

export type ICharacterizationBrowseResultModel = {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    type: CharacterizationTypeEnum;
    doneAt: string | undefined;
    order: number | undefined;
    profiles: { id: string; name: string }[];
    hierarchies: { id: string; name: string; type: HierarchyTypeEnum; }[];
    risks: { id: string; name: string }[];
    photos: { id: string; url: string }[];
    stage: { name: string; color?: string; } | undefined
}

export class CharacterizationBrowseResultModel {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    type: CharacterizationTypeEnum;
    doneAt?: string;
    order?: number;
    profiles: { id: string; name: string }[];
    hierarchies: { id: string; name: string; type: HierarchyTypeEnum; }[];
    risks: { id: string; name: string }[];
    photos: { id: string; url: string }[];
    stage?: { name: string; color?: string; }

    constructor(params: ICharacterizationBrowseResultModel) {
        this.id = params.id;
        this.createdAt = params.createdAt;
        this.updatedAt = params.updatedAt;
        this.name = params.name;
        this.type = params.type;
        this.doneAt = params.doneAt;
        this.order = params.order;

        this.profiles = params.profiles
        this.hierarchies = params.hierarchies
        this.risks = params.risks
        this.photos = params.photos
        this.stage = params.stage
    }
}