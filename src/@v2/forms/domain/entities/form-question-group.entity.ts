export type FormQuestionGroupEntityConstructor = {
  id?: number;
  name: string;
  description?: string;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
  formId: number;
};

export class FormQuestionGroupEntity {
  id: number;
  name: string;
  description?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  formId: number;

  constructor(params: FormQuestionGroupEntityConstructor) {
    this.id = params.id ?? 0;
    this.name = params.name;
    this.description = params.description;
    this.order = params.order;
    this.createdAt = params.createdAt ?? new Date();
    this.updatedAt = params.updatedAt ?? new Date();
    this.deletedAt = params.deletedAt ?? null;
    this.formId = params.formId;
  }

  equals(other: { name: string; description?: string; order: number }): boolean {
    return this.name === other.name && this.description === other.description && this.order === other.order;
  }
}
