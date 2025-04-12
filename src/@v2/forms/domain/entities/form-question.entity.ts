export type FormQuestionEntityConstructor = {
  id?: number;
  required?: boolean;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export class FormQuestionEntity {
  id: number;
  required: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(params: FormQuestionEntityConstructor) {
    this.id = params.id ?? 0;
    this.required = params.required ?? false;
    this.order = params.order;
    this.createdAt = params.createdAt ?? new Date();
    this.updatedAt = params.updatedAt ?? new Date();
  }
}
