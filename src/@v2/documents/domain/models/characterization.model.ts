import { CharacterizationTypeEnum } from "@/@v2/shared/domain/enum/security/characterization-type.enum";
import { getCharacterizationType } from "@/@v2/shared/domain/functions/security/get-characterization-type.func";
import { CharacterizationPhotoModel } from "./characterization-photos.model";

export type ICharacterizationModel = {
  name: string
  type: CharacterizationTypeEnum;
  photos: CharacterizationPhotoModel[]
}

export class CharacterizationModel {
  name: string
  type: CharacterizationTypeEnum;
  photos: CharacterizationPhotoModel[]

  constructor(params: ICharacterizationModel) {
    this.name = params.name
    this.type = params.type;
    this.photos = params.photos
  }

  get isEnviroment() {
    return getCharacterizationType(this.type).isEnviroment
  }

  get isCharacterization() {
    return getCharacterizationType(this.type).isCharacterization
  }
}