import { CharacterizationEntity } from '../../../domain/entities/characterization.entity';

export interface ICharacterizationRepository {
  findById(params: ICharacterizationRepository.FindByIdParams): ICharacterizationRepository.FindByIdReturn;
  update(params: ICharacterizationRepository.UpdateParams): ICharacterizationRepository.UpdateReturn;
  updateMany(params: ICharacterizationRepository.UpdateManyParams): ICharacterizationRepository.UpdateManyReturn;
}

export namespace ICharacterizationRepository {
  export type FindByIdParams = { companyId: string; workspaceId: string; id: string };
  export type FindByIdReturn = Promise<CharacterizationEntity | null>;

  export type UpdateParams = CharacterizationEntity;
  export type UpdateReturn = Promise<void>;

  export type UpdateManyParams = CharacterizationEntity[];
  export type UpdateManyReturn = Promise<void>;
}
