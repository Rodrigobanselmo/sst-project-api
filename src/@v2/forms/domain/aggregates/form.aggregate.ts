import { FormQuestionDataEntity } from '../entities/form-question-data.entity';
import { FormQuestionGroupEntity } from '../entities/form-question-group.entity';
import { FormQuestionOptionEntity } from '../entities/form-question-option.entity';
import { FormQuestionEntity } from '../entities/form-question.entity';
import { FormEntity } from '../entities/form.entity';
import { updateField } from '@/@v2/shared/domain/helpers/update-field.helper';

// ========================================
// TYPE DEFINITIONS
// ========================================

export type IFormQuestionAggregate = FormQuestionEntity & {
  data: FormQuestionDataEntity;
  options: FormQuestionOptionEntity[];
};

export type IFormQuestionGroupAggregate = FormQuestionGroupEntity & { questions: IFormQuestionAggregate[] };
export type IFormAggregate = {
  form: FormEntity;
  questionGroups: IFormQuestionGroupAggregate[];
};

// ========================================
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
  companyId: string;
  system: boolean;
}

interface ICreateQuestionParams {
  companyId: string;
  system: boolean;
}

interface IQuestionDataCreationInput {
  text: string;
  type: any;
  acceptOther?: boolean;
}

interface IQuestionOptionCreationInput {
  text: string;
  value?: number;
}

interface IQuestionCreationInput {
  required?: boolean;
  data: IQuestionDataCreationInput;
  options?: IQuestionOptionCreationInput[];
}

interface IQuestionGroupCreationInput {
  name: string;
  description?: string;
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
    this.form.updatedAt = new Date();
  }

  updateQuestionGroups(params: IUpdateQuestionGroupsParams) {
    params.questionGroups.forEach((newGroup, groupIndex) => {
      const questionGroupEntity = this.createQuestionGroupEntity(newGroup, groupIndex);

      if (newGroup.id) {
        const existingGroup = this.questionGroups.find((g) => g.id === newGroup.id);
        if (existingGroup) {
          this.updateQuestionGroupEntity(existingGroup, questionGroupEntity);
          this.updateQuestionsInGroup(existingGroup, newGroup.questions);
        }
      } else {
        const questionsAggregate = newGroup.questions.map((question, questionIndex) => {
          return this.createQuestionAggregate(question, questionIndex, params);
        });

        this.questionGroups.push(this.createQuestionGroupAggregate(questionGroupEntity, questionsAggregate));
      }
    });
  }

  // ========================================
  // PRIVATE UPDATE METHODS
  // ========================================

  private updateQuestionGroupEntity(existingGroup: IFormQuestionGroupAggregate, newQuestionGroupEntity: FormQuestionGroupEntity) {
    if (!existingGroup.equals(newQuestionGroupEntity)) {
      existingGroup.deletedAt = new Date();

      const existingGroupIndex = this.questionGroups.findIndex((g) => g.id === existingGroup.id);
      if (existingGroupIndex !== -1) {
        this.questionGroups[existingGroupIndex] = this.createQuestionGroupAggregate(newQuestionGroupEntity, existingGroup.questions);
      }
    }
  }

  private updateQuestionsInGroup(existingGroup: IFormQuestionGroupAggregate, newQuestions: IQuestionInput[]) {
    newQuestions.forEach((newQuestion, questionIndex) => {
      if (newQuestion.id) {
        const existingQuestion = existingGroup.questions.find((q) => q.id === newQuestion.id);
        if (existingQuestion) {
          this.updateQuestion(existingQuestion, newQuestion, questionIndex);
        }
      } else {
        const questionEntity = this.createQuestionAggregate(newQuestion, questionIndex, { companyId: '', system: false });
        existingGroup.questions.push(questionEntity);
      }
    });
  }

  private updateQuestion(existingQuestion: IFormQuestionAggregate, newQuestion: IQuestionCreationInput, questionIndex: number) {
    const newQuestionEntity = new FormQuestionEntity({
      id: 0,
      required: newQuestion.required,
      order: questionIndex + 1,
    });

    if (!existingQuestion.equals(newQuestionEntity)) {
      if ('deletedAt' in existingQuestion) {
        (existingQuestion as any).deletedAt = new Date();
      }
      if ('deletedAt' in existingQuestion.data) {
        (existingQuestion.data as any).deletedAt = new Date();
      }
      existingQuestion.options.forEach((option) => {
        if ('deletedAt' in option) {
          (option as any).deletedAt = new Date();
        }
      });

      const questionEntity = this.createQuestionAggregate(newQuestion, questionIndex, { companyId: '', system: false });

      Object.assign(existingQuestion, questionEntity);
    } else {
      this.updateQuestionData(existingQuestion.data, newQuestion.data);
      this.updateQuestionOptions(existingQuestion.options, newQuestion.options, questionIndex);
    }
  }

  private updateQuestionData(existingData: FormQuestionDataEntity, newData: IQuestionDataCreationInput) {
    const newQuestionDataEntity = new FormQuestionDataEntity({
      id: 0,
      text: newData.text,
      type: newData.type,
      acceptOther: newData.acceptOther,
      companyId: existingData.companyId,
      system: existingData.system,
    });

    if (!existingData.equals(newQuestionDataEntity)) {
      existingData.deletedAt = new Date();

      Object.assign(existingData, newQuestionDataEntity);
    }
  }

  private updateQuestionOptions(existingOptions: FormQuestionOptionEntity[], newOptions: IQuestionOptionInput[] | undefined, questionIndex: number) {
    newOptions?.forEach((newOption, optionIndex) => {
      if (newOption.id) {
        const existingOption = existingOptions.find((o) => o.id === newOption.id);
        if (existingOption) {
          const newQuestionOptionEntity = new FormQuestionOptionEntity({
            id: 0,
            text: newOption.text,
            order: optionIndex + 1,
            value: newOption.value,
          });

          if (!existingOption.equals(newQuestionOptionEntity)) {
            existingOption.deletedAt = new Date();

            Object.assign(existingOption, newQuestionOptionEntity);
          }
        }
      } else {
        const newQuestionOption = new FormQuestionOptionEntity({
          id: 0,
          text: newOption.text,
          order: optionIndex + 1,
          value: newOption.value,
        });
        existingOptions.push(newQuestionOption);
      }
    });
  }

  // ========================================
  // PRIVATE CREATION METHODS
  // ========================================

  private createQuestionGroupEntity(group: IQuestionGroupCreationInput, groupIndex: number): FormQuestionGroupEntity {
    return new FormQuestionGroupEntity({
      id: 0,
      name: group.name,
      description: group.description,
      order: groupIndex + 1,
      formId: this.form.id,
    });
  }

  private createQuestionAggregate(question: IQuestionCreationInput, questionIndex: number, params: ICreateQuestionParams): IFormQuestionAggregate {
    const questionEntity = this.createQuestionEntity(question, questionIndex);
    const questionDataEntity = this.createQuestionDataEntity(question.data, params);
    const optionsAggregate = this.createQuestionOptionsEntities(question.options);

    return {
      ...questionEntity,
      data: questionDataEntity,
      options: questionDataEntity.needsOptions ? optionsAggregate : [],
    } as IFormQuestionAggregate;
  }

  private createQuestionEntity(question: Pick<IQuestionCreationInput, 'required'>, questionIndex: number): FormQuestionEntity {
    return new FormQuestionEntity({
      id: 0,
      required: question.required,
      order: questionIndex + 1,
    });
  }

  private createQuestionDataEntity(questionData: IQuestionDataCreationInput, params: ICreateQuestionParams): FormQuestionDataEntity {
    return new FormQuestionDataEntity({
      id: 0,
      text: questionData.text,
      type: questionData.type,
      acceptOther: questionData.acceptOther,
      companyId: params.companyId,
      system: params.system,
    });
  }

  private createQuestionOptionsEntities(options: IQuestionOptionCreationInput[] | undefined): FormQuestionOptionEntity[] {
    return (
      options?.map((option, optionIndex) => {
        return new FormQuestionOptionEntity({
          id: 0,
          text: option.text,
          order: optionIndex + 1,
          value: option.value,
        });
      }) || []
    );
  }

  // ========================================
  // PRIVATE HELPER METHODS
  // ========================================

  private createQuestionGroupAggregate(questionGroupEntity: FormQuestionGroupEntity, questions: IFormQuestionAggregate[]): IFormQuestionGroupAggregate {
    return Object.assign(questionGroupEntity, { questions });
  }
}
