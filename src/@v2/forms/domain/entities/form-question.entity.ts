export type FormQuestionEntityConstructor = {
  id?: number;
  required?: boolean;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
  questionId: number;
  groupId?: number;
  identifierGroupId?: number;
};

export class FormQuestionEntity {
  id: number;
  required: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  questionId: number;
  groupId?: number;
  identifierGroupId?: number;

  constructor(params: FormQuestionEntityConstructor) {
    this.id = params.id ?? 0;
    this.required = params.required ?? false;
    this.order = params.order;
    this.createdAt = params.createdAt ?? new Date();
    this.updatedAt = params.updatedAt ?? new Date();
    this.deletedAt = params.deletedAt ?? null;
    this.questionId = params.questionId;
    this.groupId = params.groupId;
    this.identifierGroupId = params.identifierGroupId;
  }
}
