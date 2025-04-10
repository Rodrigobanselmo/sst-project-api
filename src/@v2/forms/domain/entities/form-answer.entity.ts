export type FormAnswerEntityConstructor = {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  value?: string;
  optionId?: number;
  questionId: number;
  participantsAnswersId: number;
};

export class FormAnswerEntity {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  value?: string;
  optionId?: number;
  questionId: number;
  participantsAnswersId: number;

  constructor(params: FormAnswerEntityConstructor) {
    this.id = params.id ?? 0;
    this.createdAt = params.createdAt ?? new Date();
    this.updatedAt = params.updatedAt ?? new Date();
    this.value = params.value;
    this.optionId = params.optionId;
    this.questionId = params.questionId;
    this.participantsAnswersId = params.participantsAnswersId;
  }
}
