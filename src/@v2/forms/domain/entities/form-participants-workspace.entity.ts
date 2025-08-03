import { generateCuid } from '@/@v2/shared/utils/helpers/generate-cuid';

export type FormParticipantsWorkspaceEntityConstructor = {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  workspaceId: string;
};

export class FormParticipantsWorkspaceEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  workspaceId: string;

  private _isNew: boolean;

  constructor(params: FormParticipantsWorkspaceEntityConstructor) {
    this.id = params.id ?? generateCuid();
    this.createdAt = params.createdAt ?? new Date();
    this.updatedAt = params.updatedAt ?? new Date();
    this.workspaceId = params.workspaceId;

    this._isNew = !params.id;
  }

  get isNew() {
    return this._isNew;
  }
}
