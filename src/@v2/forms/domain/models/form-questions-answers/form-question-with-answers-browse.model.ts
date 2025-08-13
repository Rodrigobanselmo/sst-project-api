import { FormQuestionTypeEnum } from '../../enums/form-question-type.enum';
import { FormAnswerBrowseModel } from './form-answer-browse.model';

export type IFormQuestionWithAnswersBrowseModel = {
  id: string;
  required: boolean;
  order: number;
  details: {
    id: string;
    text: string;
    type: FormQuestionTypeEnum;
  };
  options: {
    id: string;
    text: string;
    value?: number;
    order: number;
  }[];
  answers: FormAnswerBrowseModel[];
};

export class FormQuestionWithAnswersBrowseModel {
  id: string;
  required: boolean;
  order: number;
  details: {
    id: string;
    text: string;
    type: FormQuestionTypeEnum;
  };
  options: {
    id: string;
    text: string;
    value?: number;
    order: number;
  }[];
  answers: FormAnswerBrowseModel[];

  constructor(params: IFormQuestionWithAnswersBrowseModel) {
    this.id = params.id;
    this.required = params.required;
    this.order = params.order;
    this.details = params.details;
    this.options = params.options.sort((a, b) => a.order - b.order);
    this.answers = params.answers;
  }
}
