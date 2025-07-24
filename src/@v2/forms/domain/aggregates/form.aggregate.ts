import { updateField } from '@/@v2/shared/domain/helpers/update-field.helper';
import { FormQuestionDetailsEntity } from '../entities/form-question-details.entity';
import { FormQuestionGroupEntity } from '../entities/form-question-group.entity';
import { FormQuestionOptionEntity } from '../entities/form-question-option.entity';
import { FormQuestionEntity } from '../entities/form-question.entity';
import { FormEntity } from '../entities/form.entity';
import { FormQuestionTypeEnum } from '../enums/form-question-type.enum';

// ========================================
// TYPE DEFINITIONS
// ========================================

export type IFormQuestionAggregate = FormQuestionEntity & {
  details: FormQuestionDetailsEntity;
  options: FormQuestionOptionEntity[];
};

export type IFormQuestionGroupAggregate = FormQuestionGroupEntity & { questions: IFormQuestionAggregate[] };
export type IFormAggregate = {
  form: FormEntity;
  questionGroups: IFormQuestionGroupAggregate[];
};

// ================================p========
// INTERFACE DEFINITIONS
// ========================================

interface IUpdateFormParams {
  name: string;
  description?: string;
  type?: any;
  anonymous?: boolean;
  shareableLink?: boolean;
}

interface IQuestionDataInput {
  id?: number;
  text: string;
  type: any;
  acceptOther?: boolean;
}

interface IQuestionOptionInput {
  id?: number;
  text: string;
  value?: number;
}

interface IQuestionInput {
  id?: number;
  required?: boolean;
  data: IQuestionDataInput;
  options?: IQuestionOptionInput[];
}

interface IQuestionGroupInput {
  id?: number;
  name: string;
  description?: string;
  questions: IQuestionInput[];
}

interface IUpdateQuestionGroupsParams {
  questionGroups: IQuestionGroupInput[];
}

// ========================================
// AGGREGATE CLASS
// ========================================

export class FormAggregate {
  form: FormEntity;
  questionGroups: IFormQuestionGroupAggregate[];

  constructor(params: IFormAggregate) {
    this.form = params.form;
    this.questionGroups = params.questionGroups;
  }

  // ========================================
  // PUBLIC METHODS
  // ========================================

  updateForm(params: IUpdateFormParams) {
    this.form.name = params.name;
    this.form.description = updateField(this.form.description, params.description);
    this.form.type = updateField(this.form.type, params.type);
    this.form.anonymous = updateField(this.form.anonymous, params.anonymous);
    this.form.shareableLink = updateField(this.form.shareableLink, params.shareableLink);
  }

  updateQuestionGroups(params: IUpdateQuestionGroupsParams) {
    const newQuestionGroups = params.questionGroups;
    const currentQuestionGroups = this.questionGroups;

    // Track deleted question groups
    for (const currentGroup of currentQuestionGroups) {
      const stillExists = newQuestionGroups.some((newGroup) => newGroup.id === currentGroup.id);
      if (!stillExists) {
        this.deleteQuestionGroup(currentGroup);
      }
    }

    // Process each new question group
    for (let groupIndex = 0; groupIndex < newQuestionGroups.length; groupIndex++) {
      const newGroup = newQuestionGroups[groupIndex];
      const currentGroup = currentQuestionGroups.find((g) => g.id === newGroup.id);

      if (currentGroup) {
        this.updateQuestionGroup(currentGroup, newGroup, groupIndex);
      } else {
        this.createQuestionGroup(newGroup, groupIndex);
      }
    }
  }

  // ========================================
  // PRIVATE QUESTION GROUP METHODS
  // ========================================

  private createQuestionGroup(newGroup: IQuestionGroupInput, order: number) {
    const questionGroup = new FormQuestionGroupEntity({
      formId: this.form.id,
      name: newGroup.name,
      description: newGroup.description,
      order,
    });

    const newQuestionGroup = Object.assign(questionGroup, { questions: [] });

    this.updateQuestionsInGroup(newQuestionGroup, newGroup);

    this.questionGroups.push(newQuestionGroup);
  }

  private updateQuestionGroup(currentGroup: IFormQuestionGroupAggregate, newGroup: IQuestionGroupInput, order: number) {
    currentGroup.update({ name: newGroup.name, description: newGroup.description, order });

    this.updateQuestionsInGroup(currentGroup, newGroup);
  }

  private deleteQuestionGroup(group: IFormQuestionGroupAggregate) {
    group.delete();
  }

  // ========================================
  // PRIVATE QUESTION METHODS
  // ========================================

  private updateQuestionsInGroup(currentGroup: IFormQuestionGroupAggregate, newGroup: IQuestionGroupInput) {
    const newQuestions = newGroup.questions;
    const currentQuestions = currentGroup.questions;

    // Track deleted questions
    for (const currentQuestion of currentQuestions) {
      const stillExists = newQuestions.some((newQuestion) => newQuestion.id === currentQuestion.id);
      if (!stillExists) {
        this.deleteQuestion(currentQuestion);
      }
    }

    // Process each new question
    for (let questionIndex = 0; questionIndex < newQuestions.length; questionIndex++) {
      const newQuestion = newQuestions[questionIndex];
      const currentQuestion = currentQuestions.find((q) => q.id === newQuestion.id);

      if (currentQuestion) {
        this.updateQuestion(currentQuestion, newQuestion, questionIndex);
      } else {
        this.createQuestion(currentGroup, newQuestion, questionIndex);
      }
    }
  }

  private createQuestion(group: IFormQuestionGroupAggregate, newQuestion: IQuestionInput, order: number) {
    const questionData = new FormQuestionDetailsEntity({
      text: newQuestion.data.text,
      type: newQuestion.data.type,
      acceptOther: newQuestion.data.acceptOther,
      companyId: this.form.companyId,
    });

    const question = new FormQuestionEntity({
      required: newQuestion.required ?? false,
      order,
    });

    const newQuestionAggregate = Object.assign(question, {
      details: questionData,
      options: [],
    });

    if (newQuestion.options && newQuestionAggregate.details.needsOptions) {
      for (let optionIndex = 0; optionIndex < newQuestion.options.length; optionIndex++) {
        const optionInput = newQuestion.options[optionIndex];

        this.createQuestionOption(newQuestionAggregate, optionInput, optionIndex);
      }
    }

    group.questions.push(newQuestionAggregate);
  }

  private updateQuestion(currentQuestion: IFormQuestionAggregate, newQuestion: IQuestionInput, order: number) {
    currentQuestion.update({ required: newQuestion.required, order });

    this.updateQuestionData(currentQuestion.details, newQuestion.data);

    if (newQuestion.options && currentQuestion.details.needsOptions) {
      this.updateQuestionOptions(currentQuestion, newQuestion.options);
    }
  }

  private deleteQuestion(question: IFormQuestionAggregate) {
    question.delete();
  }

  // ========================================
  // PRIVATE QUESTION DATA METHODS
  // ========================================

  private updateQuestionData(currentData: FormQuestionDetailsEntity, newData: IQuestionDataInput) {
    currentData.update({ text: newData.text, type: newData.type, acceptOther: newData.acceptOther });
  }

  // ========================================
  // PRIVATE QUESTION OPTION METHODS
  // ========================================

  private updateQuestionOptions(currentQuestion: IFormQuestionAggregate, newOptions: IQuestionOptionInput[]) {
    const currentOptions = currentQuestion.options;

    // Track deleted options
    for (const currentOption of currentOptions) {
      const stillExists = newOptions.some((newOption) => newOption.id === currentOption.id);
      if (!stillExists) {
        this.deleteQuestionOption(currentOption);
      }
    }

    // Process each new option
    for (let optionIndex = 0; optionIndex < newOptions.length; optionIndex++) {
      const newOption = newOptions[optionIndex];
      const currentOption = currentOptions.find((o) => o.id === newOption.id);

      if (currentOption) {
        this.updateQuestionOption(currentOption, newOption, optionIndex);
      } else {
        this.createQuestionOption(currentQuestion, newOption, optionIndex);
      }
    }
  }

  private createQuestionOption(question: IFormQuestionAggregate, newOption: IQuestionOptionInput, order: number) {
    const option = new FormQuestionOptionEntity({
      text: newOption.text,
      value: newOption.value,
      order: order,
    });
    question.options.push(option);
  }

  private updateQuestionOption(currentOption: FormQuestionOptionEntity, newOption: IQuestionOptionInput, order: number) {
    currentOption.update({ text: newOption.text, value: newOption.value, order });
  }

  private deleteQuestionOption(option: FormQuestionOptionEntity) {
    option.deletedAt = new Date();
  }
}
