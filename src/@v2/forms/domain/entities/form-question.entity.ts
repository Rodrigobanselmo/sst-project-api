export type FormQuestionEntityConstructor = {
  id?: number;
  required?: boolean;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
};

export class FormQuestionEntity {
  id: number;
  required: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  constructor(params: FormQuestionEntityConstructor) {
    this.id = params.id ?? 0;
    this.required = params.required ?? false;
    this.order = params.order;
    this.createdAt = params.createdAt ?? new Date();
    this.updatedAt = params.updatedAt ?? new Date();
    this.deletedAt = params.deletedAt;
  }

  equals(other: { required?: boolean; order: number }): boolean {
    return this.required === other.required && this.order === other.order;
  }
}
