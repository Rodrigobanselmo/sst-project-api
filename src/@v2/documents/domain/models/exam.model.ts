import { ExamRequirementsVO } from "@/@v2/shared/domain/values-object/medicine/exam-requirements.vo";
import { RiskModel } from "./risk.model";

export type IExamModel = {
  id: number;
  name: string;
  examRisks: {
    risk: RiskModel;
    requirements: ExamRequirementsVO
  }[];
}

export class ExamModel {
  id: number;
  name: string;
  examRisks: {
    risk: RiskModel;
    requirements: ExamRequirementsVO
  }[];

  constructor(params: IExamModel) {
    this.id = params.id;
    this.name = params.name;
    this.examRisks = params.examRisks;
  }
}
