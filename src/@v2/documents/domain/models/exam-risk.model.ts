import { ExamRequirementVO } from "@/@v2/shared/domain/values-object/medicine/exam-requirement.vo";

export type IExamRiskModel = {
  examId: number;
  requirement: ExamRequirementVO;
}

export class ExamRiskModel {
  examId: number;
  requirement: ExamRequirementVO;


  constructor(params: IExamRiskModel) {
    this.examId = params.examId;
    this.requirement = params.requirement;
  }
}
