import { CharacterizationTypeEnum } from "@/@v2/shared/domain/enum/security/characterization-type.enum";
import { getCharacterizationType } from "@/@v2/shared/domain/functions/security/get-characterization-type.func";

export type ICharacterizationModel = {
  name: string
  type: CharacterizationTypeEnum;
}

export class CharacterizationModel {
  name: string
  type: CharacterizationTypeEnum;

  constructor(params: ICharacterizationModel) {
    this.name = params.name
    this.type = params.type;
  }

  get isEnviroment() {
    return getCharacterizationType(this.type).isEnviroment
  }

  get isCharacterization() {
    return getCharacterizationType(this.type).isCharacterization
  }
}