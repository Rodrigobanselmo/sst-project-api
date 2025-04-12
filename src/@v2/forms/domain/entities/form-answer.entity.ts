export type FormAnswerEntityConstructor = {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  value?: string;
};

export class FormAnswerEntity {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  value?: string;

  constructor(params: FormAnswerEntityConstructor) {
    this.id = params.id ?? 0;
    this.createdAt = params.createdAt ?? new Date();
    this.updatedAt = params.updatedAt ?? new Date();
    this.value = params.value;
  }
}
