import { DomainResponse } from '@/@v2/shared/domain/types/shared/domain-response';
import { FormApplicationEntity } from '../entities/form-application.entity';
import { FormParticipantsHierarchyEntity } from '../entities/form-participants-hierarchy.entity';
import { FormParticipantsWorkspaceEntity } from '../entities/form-participants-workspace.entity';
import { FormEntity } from '../entities/form.entity';
import { errorFormAlreadyStarted } from '../errors/domain.errors';
import { FormQuestionIdentifierGroupAggregate } from './form-question-identifier-group.aggregate';
import { FormQuestionGroupEntity } from '../entities/form-question-group.entity';
import { FormQuestionAggregate } from './form-question.aggregate';
import { FormQuestionDetailsEntity } from '../entities/form-question-details.entity';
import { FormQuestionEntity } from '../entities/form-question.entity';
import { FormQuestionOptionEntity } from '../entities/form-question-option.entity';
import { FormQuestionIdentifierEntity } from '../entities/form-question-identifier.entity';
import { FormParticipantsAggregate } from './form-participants.aggregate';

export type IFormApplicationAggregate = {
  formApplication: FormApplicationEntity;
  form: FormEntity;
  participants: FormParticipantsAggregate | null;
  identifier: FormQuestionIdentifierGroupAggregate | null;
};

export interface IIdentifierQuestionInput {
  id?: string;
  required?: boolean;
  identifierEntity: FormQuestionIdentifierEntity;
  details: {
    text: string;
    type: any;
    identifierType: any;
    acceptOther?: boolean;
  };
  options?: {
    id?: string;
    text: string;
    value?: number;
  }[];
}

interface IIdentifierInput {
  name: string;
  description?: string;
  questions: IIdentifierQuestionInput[];
}

interface IUpdateIdentifierParams {
  identifier: IIdentifierInput;
}

export class FormApplicationAggregate {
  formApplication: FormApplicationEntity;
  identifier: FormQuestionIdentifierGroupAggregate;
  private _form: FormEntity;
  private _participants: FormParticipantsAggregate | null;

  constructor(params: IFormApplicationAggregate) {
    this.formApplication = params.formApplication;
    this._form = params.form;
    this.identifier = params.identifier;
    this._participants = params.participants;
  }

  get form() {
    return this._form;
  }

  get participantsWorkspaces() {
    return this._participants?.participantsWorkspaces || [];
  }

  get participantsHierarchies() {
    return this._participants?.participantsHierarchies || [];
  }

  setForm(value: FormEntity): DomainResponse {
    if (this.formApplication.hasStarted) return [, errorFormAlreadyStarted];

    this._form = value;

    return [, null];
  }

  setParticipantsWorkspaces(value: FormParticipantsWorkspaceEntity[]): DomainResponse {
    if (this.formApplication.hasStarted) return [, errorFormAlreadyStarted];

    if (!this._participants) return [, null];
    return this._participants.setParticipantsWorkspaces(value);
  }

  setParticipantsHierarchies(value: FormParticipantsHierarchyEntity[]): DomainResponse {
    if (this.formApplication.hasStarted) return [, errorFormAlreadyStarted];

    if (!this._participants) return [, null];
    return this._participants.setParticipantsHierarchies(value);
  }

  updateIdentifier(params: IUpdateIdentifierParams) {
    if (this.formApplication.hasStarted) return [, errorFormAlreadyStarted];

    const newIdentifier = params.identifier;

    this.identifier.questionGroup.update({
      name: newIdentifier.name,
      description: newIdentifier.description,
    });

    this.updateIdentifierQuestions(newIdentifier);

    return [, null];
  }

  // ========================================
  // PRIVATE IDENTIFIER METHODS
  // ========================================

  private updateIdentifierQuestions(newIdentifier: IIdentifierInput) {
    const newQuestions = newIdentifier.questions;
    const currentQuestions = this.identifier.questions;

    // Track deleted questions
    for (const currentQuestion of currentQuestions) {
      const stillExists = newQuestions.some((newQuestion) => newQuestion.id === currentQuestion.question.id);
      if (!stillExists) {
        this.deleteIdentifierQuestion(currentQuestion);
      }
    }

    // Process each new question
    for (let questionIndex = 0; questionIndex < newQuestions.length; questionIndex++) {
      const newQuestion = newQuestions[questionIndex];
      const currentQuestion = currentQuestions.find((q) => q.question.id === newQuestion.id);

      if (currentQuestion) {
        this.updateIdentifierQuestion(currentQuestion, newQuestion, questionIndex);
      } else {
        this.createIdentifierQuestion(newQuestion, questionIndex);
      }
    }
  }

  private createIdentifierQuestion(newQuestion: IIdentifierQuestionInput, order: number) {
    const questionEntity = new FormQuestionEntity({
      order,
      required: newQuestion.required,
      groupId: this.identifier.questionGroup.id,
    });

    const detailsEntity = new FormQuestionDetailsEntity({
      text: newQuestion.details.text,
      type: newQuestion.details.type,
      companyId: this.formApplication.companyId,
      acceptOther: newQuestion.details.acceptOther,
    });

    const optionsEntities: FormQuestionOptionEntity[] = [];
    if (detailsEntity.needsOptions && newQuestion.options) {
      newQuestion.options.forEach((option, optionIndex) => {
        const optionEntity = new FormQuestionOptionEntity({
          text: option.text,
          order: optionIndex,
          value: option.value,
        });
        optionsEntities.push(optionEntity);
      });
    }

    const questionAggregate = new FormQuestionAggregate({
      question: questionEntity,
      details: detailsEntity,
      options: optionsEntities,
      identifier: newQuestion.identifierEntity,
    });

    this.identifier.questions.push(questionAggregate);
  }

  private updateIdentifierQuestion(currentQuestion: FormQuestionAggregate, newQuestion: IIdentifierQuestionInput, order: number) {
    currentQuestion.question.update({
      required: newQuestion.required,
      order,
    });

    currentQuestion.details.update({
      text: newQuestion.details.text,
      type: newQuestion.details.type,
      acceptOther: newQuestion.details.acceptOther,
    });

    currentQuestion.identifier = newQuestion.identifierEntity;

    this.updateIdentifierQuestionOptions(currentQuestion, newQuestion.options || []);
  }

  private deleteIdentifierQuestion(question: FormQuestionAggregate) {
    question.question.delete();
  }

  private updateIdentifierQuestionOptions(currentQuestion: FormQuestionAggregate, newOptions: IIdentifierQuestionInput['options']) {
    if (!newOptions) return;

    const currentOptions = currentQuestion.options;

    // Track deleted options
    for (const currentOption of currentOptions) {
      const stillExists = newOptions.some((newOption) => newOption.id === currentOption.id);
      if (!stillExists) {
        this.deleteIdentifierQuestionOption(currentOption);
      }
    }

    // Process each new option
    for (let optionIndex = 0; optionIndex < newOptions.length; optionIndex++) {
      const newOption = newOptions[optionIndex];
      const currentOption = currentOptions.find((o) => o.id === newOption.id);

      if (currentOption) {
        this.updateIdentifierQuestionOption(currentOption, newOption, optionIndex);
      } else {
        this.createIdentifierQuestionOption(currentQuestion, newOption, optionIndex);
      }
    }
  }

  private createIdentifierQuestionOption(question: FormQuestionAggregate, newOption: IIdentifierQuestionInput['options'][0], order: number) {
    if (!newOption) return;

    const optionEntity = new FormQuestionOptionEntity({
      text: newOption.text,
      order,
      value: newOption.value,
    });

    question.options.push(optionEntity);
  }

  private updateIdentifierQuestionOption(currentOption: FormQuestionOptionEntity, newOption: IIdentifierQuestionInput['options'][0], order: number) {
    if (!newOption) return;

    currentOption.update({
      text: newOption.text,
      value: newOption.value,
      order,
    });
  }

  private deleteIdentifierQuestionOption(option: FormQuestionOptionEntity) {
    option.deletedAt = new Date();
  }
}
