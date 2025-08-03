import { FormQuestionReadModel } from './form-question-read.model';

export type IFormQuestionGroupReadModel = {
  id: string;
  name: string;
  description?: string;
  order: number;
  questions: FormQuestionReadModel[];
};

export class FormQuestionGroupReadModel {
  id: string;
  name: string;
  description?: string;
  order: number;
  questions: FormQuestionReadModel[];

  constructor(params: IFormQuestionGroupReadModel) {
    this.id = params.id;
    this.name = params.name;
    this.description = params.description;
    this.order = params.order;
    this.questions = params.questions.sort((a, b) => a.order - b.order);
  }
}
