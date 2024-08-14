import { CharacterizationTypeEnum } from "@/@v2/shared/domain/enum/security/characterization-type.enum";

export type ICharacterizationVO = {
  name: string
  type: CharacterizationTypeEnum;
}

export class CharacterizationVO {
  name: string
  type: CharacterizationTypeEnum;

  constructor(params: ICharacterizationVO) {
    this.name = params.name
    this.type = params.type;
  }
}