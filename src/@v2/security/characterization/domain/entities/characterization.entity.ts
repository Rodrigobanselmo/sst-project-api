import { updateField } from '@/@v2/shared/domain/helpers/update-field.helper';

export type IUpdateCharacterization = {
  stageId?: number | null;
};

export type ICharacterizationEntity = {
  id: string;
  companyId: string;
  workspaceId: string;
  stageId: number | null;
};

export class CharacterizationEntity {
  id: string;
  companyId: string;
  workspaceId: string;
  stageId: number | null;

  constructor(partial: ICharacterizationEntity) {
    this.id = partial.id;
    this.companyId = partial.companyId;
    this.workspaceId = partial.workspaceId;
    this.stageId = partial.stageId;
  }

  update(params: IUpdateCharacterization) {
    this.stageId = updateField(this.stageId, params.stageId);
  }
}
