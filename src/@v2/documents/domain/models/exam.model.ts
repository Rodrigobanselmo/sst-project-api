import { ExamRequirementVO } from "@/@v2/shared/domain/values-object/medicine/exam-requirement.vo";

export type IExamModel = {
  id: number;
  name: string;
  examRisks: {
    riskId: string;
    requirement: ExamRequirementVO
  }[];
}

export class ExamModel {
  id: number;
  name: string;
  examRisks: {
    riskId: string;
    requirement: ExamRequirementVO
  }[];

  constructor(params: IExamModel) {
    this.id = params.id;
    this.name = params.name;
    this.examRisks = params.examRisks;
  }
}
