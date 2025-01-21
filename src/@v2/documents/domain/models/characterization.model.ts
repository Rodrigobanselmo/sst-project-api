import { CharacterizationTypeEnum } from '@/@v2/shared/domain/enum/security/characterization-type.enum';
import { getCharacterizationType } from '@/@v2/shared/domain/functions/security/get-characterization-type.func';
import { CharacterizationPhotoModel } from './characterization-photos.model';

export type ICharacterizationModel = {
  id: string;
  name: string;
  description: string | null;
  type: CharacterizationTypeEnum;
  considerations: string[];
  activities: string[];
  paragraphs: string[];

  luminosity: string | null;
  moisturePercentage: string | null;
  noiseValue: string | null;
  temperature: string | null;

  profileName: string | null;
  profileParentId: string | null;

  photos: CharacterizationPhotoModel[];
};

export class CharacterizationModel {
  id: string;
  name: string;
  description: string | null;
  type: CharacterizationTypeEnum;
  considerations: string[];
  activities: string[];
  paragraphs: string[];

  luminosity: string | null;
  moisturePercentage: string | null;
  noiseValue: string | null;
  temperature: string | null;

  profileName: string | null;
  profileParentId: string | null;

  photos: CharacterizationPhotoModel[];

  constructor(params: ICharacterizationModel) {
    this.id = params.id;
    this.name = params.name;
    this.description = params.description;
    this.type = params.type;
    this.considerations = params.considerations;
    this.activities = params.activities;
    this.paragraphs = params.paragraphs;

    this.luminosity = params.luminosity;
    this.moisturePercentage = params.moisturePercentage;
    this.noiseValue = params.noiseValue;
    this.temperature = params.temperature;

    this.profileName = params.profileName;
    this.profileParentId = params.profileParentId;

    this.photos = params.photos;
  }

  get isEnviroment() {
    return getCharacterizationType(this.type).isEnviroment;
  }

  get isCharacterization() {
    return getCharacterizationType(this.type).isCharacterization;
  }
}
