import { CharacterizationTypeEnum } from "@/@v2/shared/domain/enum/security/characterization-type.enum";

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
}