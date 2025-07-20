export type FormQuestionOptionEntityConstructor = {
  id?: number;
  text: string;
  order: number;
  value?: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
};

export class FormQuestionOptionEntity {
  id: number;
  text: string;
  order: number;
  value?: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  constructor(params: FormQuestionOptionEntityConstructor) {
    this.id = params.id ?? 0;
    this.text = params.text;
    this.order = params.order;
    this.value = params.value;
    this.createdAt = params.createdAt ?? new Date();
    this.updatedAt = params.updatedAt ?? new Date();
    this.deletedAt = params.deletedAt;
  }

  equals(other: { text: string; value?: number; order: number }): boolean {
    return this.text === other.text && this.value === other.value && this.order === other.order;
  }
}
