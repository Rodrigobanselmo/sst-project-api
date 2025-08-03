import { FormQuestionDetailsReadModel } from './form-question-details-read.model';
import { FormQuestionOptionReadModel } from './form-question-option-read.model';

export type IFormQuestionReadModel = {
  id: string;
  required: boolean;
  order: number;
  details: FormQuestionDetailsReadModel;
  options: FormQuestionOptionReadModel[];
};

export class FormQuestionReadModel {
  id: string;
  required: boolean;
  order: number;
  details: FormQuestionDetailsReadModel;
  options: FormQuestionOptionReadModel[];

  constructor(params: IFormQuestionReadModel) {
    this.id = params.id;
    this.required = params.required;
    this.order = params.order;
    this.details = params.details;
    this.options = params.options.sort((a, b) => a.order - b.order);
  }
}
