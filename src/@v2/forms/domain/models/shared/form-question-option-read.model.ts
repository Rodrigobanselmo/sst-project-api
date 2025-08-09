export type IFormQuestionOptionReadModel = {
  id: string;
  text: string;
  value?: number;
  order: number;
};

export class FormQuestionOptionReadModel {
  id: string;
  text: string;
  value?: number;
  order: number;

  constructor(params: IFormQuestionOptionReadModel) {
    this.id = params.id;
    this.text = params.text;
    this.value = params.value;
    this.order = params.order;
  }
}
