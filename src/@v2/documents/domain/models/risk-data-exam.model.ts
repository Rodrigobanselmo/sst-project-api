import { ExamRequirementVO } from "@/@v2/shared/domain/values-object/medicine/exam-requirement.vo";
import { ExamModel } from "./exam.model";

export type IRiskDataExamModel = {
  exam: ExamModel;
  requirement: ExamRequirementVO
}

export class RiskDataExamModel {
  exam: ExamModel;
  requirement: ExamRequirementVO

  constructor(params: IRiskDataExamModel) {
    this.exam = params.exam;
    this.requirement = params.requirement;
  }
}
