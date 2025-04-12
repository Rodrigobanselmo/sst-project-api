export type FormQuestionOptionEntityConstructor = {
  id?: number;
  text: string;
  order: number;
  value: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export class FormQuestionOptionEntity {
  id: number;
  text: string;
  order: number;
  value: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(params: FormQuestionOptionEntityConstructor) {
    this.id = params.id ?? 0;
    this.text = params.text;
    this.order = params.order;
    this.value = params.value;
    this.createdAt = params.createdAt ?? new Date();
    this.updatedAt = params.updatedAt ?? new Date();
  }
}
