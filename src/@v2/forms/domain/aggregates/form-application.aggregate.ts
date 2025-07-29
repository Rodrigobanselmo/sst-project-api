import { DomainResponse } from '@/@v2/shared/domain/types/shared/domain-response';
import { FormApplicationEntity } from '../entities/form-application.entity';
import { FormParticipantsHierarchyEntity } from '../entities/form-participants-hierarchy.entity';
import { FormParticipantsWorkspaceEntity } from '../entities/form-participants-workspace.entity';
import { FormEntity } from '../entities/form.entity';
import { errorFormAlreadyStarted } from '../errors/domain.errors';
import { FormQuestionIdentifierGroupAggregate } from './form-question-identifier-group.aggregate';

export type IFormApplicationAggregate = {
  formApplication: FormApplicationEntity;
  form: FormEntity;
  participantsWorkspaces: FormParticipantsWorkspaceEntity[];
  participantsHierarchies: FormParticipantsHierarchyEntity[];
  identifier: FormQuestionIdentifierGroupAggregate | null;
};

export class FormApplicationAggregate {
  formApplication: FormApplicationEntity;
  identifier: FormQuestionIdentifierGroupAggregate | null;
  private _form: FormEntity;
  private _participants: {
    workspaces: FormParticipantsWorkspaceEntity[];
    hierarchies: FormParticipantsHierarchyEntity[];
  };

  constructor(params: IFormApplicationAggregate) {
    this.formApplication = params.formApplication;
    this._form = params.form;
    this.identifier = params.identifier;
    this._participants = {
      workspaces: params.participantsWorkspaces || [],
      hierarchies: params.participantsHierarchies || [],
    };
  }

  get form() {
    return this._form;
  }

  get participantsWorkspaces() {
    return this._participants.workspaces;
  }

  get participantsHierarchies() {
    return this._participants.hierarchies;
  }

  setForm(value: FormEntity): DomainResponse {
    if (this.formApplication.hasStarted) return [, errorFormAlreadyStarted];

    this._form = value;

    return [, null];
  }

  setParticipantsWorkspaces(value: FormParticipantsWorkspaceEntity[]): DomainResponse {
    if (this.formApplication.hasStarted) return [, errorFormAlreadyStarted];

    this._participants.workspaces = value.map((workspace) => {
      return this._participants.workspaces.find((w) => w.workspaceId === workspace.workspaceId) || workspace;
    });

    return [, null];
  }

  setParticipantsHierarchies(value: FormParticipantsHierarchyEntity[]): DomainResponse {
    if (this.formApplication.hasStarted) return [, errorFormAlreadyStarted];

    this._participants.hierarchies = value.map((hierarchy) => {
      return this._participants.hierarchies.find((h) => h.hierarchyId === hierarchy.hierarchyId) || hierarchy;
    });

    return [, null];
  }
}
