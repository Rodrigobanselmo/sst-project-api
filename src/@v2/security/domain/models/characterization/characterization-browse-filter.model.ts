import { CharacterizationTypeEnum } from "@/@v2/shared/domain/enum/security/characterization-type.enum";

export type ICharacterizationBrowseFilterModel = {
    types: CharacterizationTypeEnum[]
    stages: ({ id: number; name: string; color?: string } | null)[]
}

export class CharacterizationBrowseFilterModel {
    types: CharacterizationTypeEnum[]
    stages: ({ id: number; name: string; color?: string } | null)[]

    constructor(params: ICharacterizationBrowseFilterModel) {
        this.types = params.types;
        this.stages = params.stages;
    }
}