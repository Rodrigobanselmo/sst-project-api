import { ExamRequirementsVO } from "@/@v2/shared/domain/values-object/medicine/exam-requirements.vo";

export type IExamRiskModel = {
  examId: number;
  requirements: ExamRequirementsVO;
}

export class ExamRiskModel {
  examId: number;
  requirements: ExamRequirementsVO;


  constructor(params: IExamRiskModel) {
    this.examId = params.examId;
    this.requirements = params.requirements;
  }
}
