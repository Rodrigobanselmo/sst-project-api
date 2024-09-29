import { HierarchyTypeEnum } from "@/@v2/shared/domain/enum/company/hierarchy-type.enum";
import { CharacterizationTypeEnum } from "@/@v2/shared/domain/enum/security/characterization-type.enum";

export type ICharacterizationBrowseResultModel = {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    type: CharacterizationTypeEnum;
    doneAt: string | null;
    order: number | null;
    profiles: { id: string; name: string }[];
    hierarchies: { id: string; name: string; type: HierarchyTypeEnum; }[];
    risks: { id: string; name: string }[];
    photos: { id: string; url: string }[];
}

export class CharacterizationBrowseResultModel {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    type: CharacterizationTypeEnum;
    doneAt: string | null;
    order: number | null;
    profiles: { id: string; name: string }[];
    hierarchies: { id: string; name: string; type: HierarchyTypeEnum; }[];
    risks: { id: string; name: string }[];
    photos: { id: string; url: string }[];

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
    }
}