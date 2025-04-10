export type FormQuestionIdentifierGroupEntityConstructor = {
  id?: number;
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export class FormQuestionIdentifierGroupEntity {
  id: number;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(params: FormQuestionIdentifierGroupEntityConstructor) {
    this.id = params.id ?? 0;
    this.name = params.name;
    this.description = params.description;
    this.createdAt = params.createdAt ?? new Date();
    this.updatedAt = params.updatedAt ?? new Date();
  }
}
