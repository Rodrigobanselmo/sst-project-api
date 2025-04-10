export type FormParticipantsWorkspaceEntityConstructor = {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  workspaceId: string;
  formParticipantsId: number;
};

export class FormParticipantsWorkspaceEntity {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  workspaceId: string;
  formParticipantsId: number;

  constructor(params: FormParticipantsWorkspaceEntityConstructor) {
    this.id = params.id ?? 0;
    this.createdAt = params.createdAt ?? new Date();
    this.updatedAt = params.updatedAt ?? new Date();
    this.workspaceId = params.workspaceId;
    this.formParticipantsId = params.formParticipantsId;
  }
}
