import { FormQuestionWithAnswersBrowseModel } from './form-question-with-answers-browse.model';

export type IFormQuestionGroupWithAnswersBrowseModel = {
  id: string;
  name: string;
  description?: string;
  order: number;
  identifier: boolean;
  questions: FormQuestionWithAnswersBrowseModel[];
};

export class FormQuestionGroupWithAnswersBrowseModel {
  id: string;
  name: string;
  description?: string;
  order: number;
  identifier: boolean;
  questions: FormQuestionWithAnswersBrowseModel[];

  constructor(params: IFormQuestionGroupWithAnswersBrowseModel) {
    this.id = params.id;
    this.name = params.name;
    this.description = params.description;
    this.order = params.identifier ? -1 : params.order;
    this.identifier = params.identifier;
    this.questions = params.questions.sort((a, b) => a.order - b.order);
  }
}
