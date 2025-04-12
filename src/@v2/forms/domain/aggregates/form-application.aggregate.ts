import { FormApplicationEntity } from '../entities/form-application.entity';
import { FormParticipantsHierarchyEntity } from '../entities/form-participants-hierarchy.entity';
import { FormParticipantsWorkspaceEntity } from '../entities/form-participants-workspace.entity';
import { FormEntity } from '../entities/form.entity';
import { FormQuestionIdentifierGroupAggregate } from './form-question-identifier-group.aggregate';

export type IFormApplicationAggregate = {
  formApplication: FormApplicationEntity;
  form: FormEntity;
  participantsWorkspaces: FormParticipantsWorkspaceEntity[];
  participantsHierarchies: FormParticipantsHierarchyEntity[];
  identifier?: FormQuestionIdentifierGroupAggregate;
};

export class FormApplicationAggregate {
  formApplication: FormApplicationEntity;
  form: FormEntity;
  participantsWorkspaces: FormParticipantsWorkspaceEntity[];
  participantsHierarchies: FormParticipantsHierarchyEntity[];
  identifier?: FormQuestionIdentifierGroupAggregate;

  constructor(params: IFormApplicationAggregate) {
    this.formApplication = params.formApplication;
    this.form = params.form;
    this.participantsWorkspaces = params.participantsWorkspaces || [];
    this.participantsHierarchies = params.participantsHierarchies || [];
    this.identifier = params.identifier;
  }
}
