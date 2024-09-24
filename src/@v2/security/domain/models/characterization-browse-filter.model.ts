import { CharacterizationTypeEnum } from "@/@v2/shared/domain/enum/security/characterization-type.enum";

export type ICharacterizationBrowseFilterModel = {
    types: CharacterizationTypeEnum[]
}

export class CharacterizationBrowseFilterModel {
    types: CharacterizationTypeEnum[]


    constructor(params: ICharacterizationBrowseFilterModel) {
        this.types = params.types;
    }
}