export type FormQuestionOptionEntityConstructor = {
  id?: number;
  text: string;
  order: number;
  value: number;
  questionId: number;
};

export class FormQuestionOptionEntity {
  id: number;
  text: string;
  order: number;
  value: number;
  questionId: number;

  constructor(params: FormQuestionOptionEntityConstructor) {
    this.id = params.id ?? 0;
    this.text = params.text;
    this.order = params.order;
    this.value = params.value;
    this.questionId = params.questionId;
  }
}
