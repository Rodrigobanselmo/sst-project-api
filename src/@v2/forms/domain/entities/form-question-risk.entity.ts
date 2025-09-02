import { generateCuid } from '@/@v2/shared/utils/helpers/generate-cuid';

export type FormQuestionRiskEntityConstructor = {
  id?: string;
  questionId: string;
  riskId: string;
};

export class FormQuestionRiskEntity {
  id: string;
  questionId: string;
  riskId: string;

  constructor(params: FormQuestionRiskEntityConstructor) {
    this.id = params.id ?? generateCuid();
    this.questionId = params.questionId;
    this.riskId = params.riskId;
  }
}
