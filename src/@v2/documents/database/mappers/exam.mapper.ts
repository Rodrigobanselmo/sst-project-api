import { ExamRequirementVO } from '@/@v2/shared/domain/values-object/medicine/exam-requirement.vo';
import { Exam, ExamToRisk } from '@prisma/client';
import { ExamModel, IExamModel } from '../../domain/models/exam.model';

export type IExamMapper = Exam & {
  examToRisk: (ExamToRisk)[]
}

export class ExamMapper {
  static toModel(data: IExamMapper): ExamModel {

    const examRisks = [] as IExamModel['examRisks']
    data.examToRisk.forEach(etr => {
      if (!etr.riskId) return

      examRisks.push({
        requirement: new ExamRequirementVO(etr),
        riskId: etr.riskId,
      })
    })

    return new ExamModel({
      id: data.id,
      name: data.name,
      examRisks
    })
  }

  static toModels(data: IExamMapper[]): ExamModel[] {
    return data.map(Exam => this.toModel(Exam))
  }
}
