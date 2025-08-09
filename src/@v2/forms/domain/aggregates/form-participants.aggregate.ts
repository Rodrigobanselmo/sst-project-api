import { DomainResponse } from '@/@v2/shared/domain/types/shared/domain-response';
import { FormParticipantsEntity } from '../entities/form-participants.entity';
import { FormParticipantsWorkspaceEntity } from '../entities/form-participants-workspace.entity';
import { FormParticipantsHierarchyEntity } from '../entities/form-participants-hierarchy.entity';

export type IFormParticipantsAggregate = {
  formParticipants: FormParticipantsEntity;
  participantsWorkspaces: FormParticipantsWorkspaceEntity[];
  participantsHierarchies: FormParticipantsHierarchyEntity[];
};

export class FormParticipantsAggregate {
  formParticipants: FormParticipantsEntity;
  private _participants: {
    workspaces: FormParticipantsWorkspaceEntity[];
    hierarchies: FormParticipantsHierarchyEntity[];
  };

  constructor(params: IFormParticipantsAggregate) {
    this.formParticipants = params.formParticipants;
    this._participants = {
      workspaces: params.participantsWorkspaces || [],
      hierarchies: params.participantsHierarchies || [],
    };
  }

  get participantsWorkspaces() {
    return this._participants.workspaces;
  }

  get participantsHierarchies() {
    return this._participants.hierarchies;
  }

  setParticipantsWorkspaces(value: FormParticipantsWorkspaceEntity[]): DomainResponse {
    this._participants.workspaces = value.map((workspace) => {
      return this._participants.workspaces.find((w) => w.workspaceId === workspace.workspaceId) || workspace;
    });

    return [, null];
  }

  setParticipantsHierarchies(value: FormParticipantsHierarchyEntity[]): DomainResponse {
    this._participants.hierarchies = value.map((hierarchy) => {
      return this._participants.hierarchies.find((h) => h.hierarchyId === hierarchy.hierarchyId) || hierarchy;
    });

    return [, null];
  }
}
