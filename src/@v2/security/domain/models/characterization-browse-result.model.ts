import { CharacterizationTypeEnum } from "@/@v2/shared/domain/enum/security/characterization-type.enum";

export type ICharacterizationBrowseResultModel = {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    type: CharacterizationTypeEnum;
    doneAt: string | null;
    order: number | null;
    profiles: {
        id: string;
        name: string;
    }[];
    hierarchies: {
        id: string;
        name: string;
    }[];
    riskfactors: {
        id: string;
        name: string;
    }[];
    photos: {
        id: string;
        url: string;
    }[];
}

export class CharacterizationBrowseResultModel {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    type: CharacterizationTypeEnum;
    doneAt: string | null;
    order: number | null;
    profiles: {
        id: string;
        name: string;
    }[];
    hierarchies: {
        id: string;
        name: string;
    }[];
    riskfactors: {
        id: string;
        name: string;
    }[];
    photos: {
        id: string;
        url: string;
    }[];

    constructor(params: ICharacterizationBrowseResultModel) {
        this.id = params.id;
        this.createdAt = params.createdAt;
        this.updatedAt = params.updatedAt;
        this.name = params.name;
        this.type = params.type;
        this.doneAt = params.doneAt;
        this.order = params.order;

        this.profiles = params.profiles.map(profile => ({
            id: profile.id,
            name: profile.name
        }));
        this.hierarchies = params.hierarchies.map(hierarchy => ({
            id: hierarchy.id,
            name: hierarchy.name
        }));
        this.riskfactors = params.riskfactors.map(riskfactor => ({
            id: riskfactor.id,
            name: riskfactor.name
        }));
        this.photos = params.photos.map(photo => ({
            id: photo.id,
            url: photo.url
        }));
    }
}