export type FormQuestionRiskEntityConstructor = {
  id?: number;
  questionId: number;
  riskId: string;
};

export class FormQuestionRiskEntity {
  id: number;
  questionId: number;
  riskId: string;

  constructor(params: FormQuestionRiskEntityConstructor) {
    this.id = params.id ?? 0;
    this.questionId = params.questionId;
    this.riskId = params.riskId;
  }
}
