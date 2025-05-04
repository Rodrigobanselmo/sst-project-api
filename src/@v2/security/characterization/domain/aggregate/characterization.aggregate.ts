import { CharacterizationEntity } from '../entities/characterization.entity';

export type ICharacterizationAggregate = {
  characterization: CharacterizationEntity;
};

export class CharacterizationAggregate {
  characterization: CharacterizationEntity;

  constructor(params: ICharacterizationAggregate) {
    this.characterization = params.characterization;
  }
}
