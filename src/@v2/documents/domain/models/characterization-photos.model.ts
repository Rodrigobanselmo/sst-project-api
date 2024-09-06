
export type ICharacterizationPhotoModel = {
  name: string
  isVertical: boolean;
  url: string;
}

export class CharacterizationPhotoModel {
  name: string
  isVertical: boolean;
  url: string;

  path: string | null;

  constructor(params: ICharacterizationPhotoModel) {
    this.name = params.name
    this.isVertical = params.isVertical
    this.url = params.url

    this.path = null
  }
}