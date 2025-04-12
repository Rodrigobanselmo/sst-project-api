export type FormParticipantsWorkspaceEntityConstructor = {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  workspaceId: string;
};

export class FormParticipantsWorkspaceEntity {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  workspaceId: string;

  constructor(params: FormParticipantsWorkspaceEntityConstructor) {
    this.id = params.id ?? 0;
    this.createdAt = params.createdAt ?? new Date();
    this.updatedAt = params.updatedAt ?? new Date();
    this.workspaceId = params.workspaceId;
  }
}
