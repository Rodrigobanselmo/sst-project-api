import { Exam, ExamToRisk } from '@prisma/client';
import { ExamModel, IExamModel } from '../../domain/models/exam.model';
import { ExamRequirementsVO } from '@/@v2/shared/domain/values-object/medicine/exam-requirements.vo';
import { IRiskMapper, RiskMapper } from './risk.mapper';

export type IExamMapper = Exam & {
  examToRisk: (ExamToRisk & {
    risk: IRiskMapper | null
  })[]
}

export class ExamMapper {
  static toModel(data: IExamMapper): ExamModel {

    const examRisks = [] as IExamModel['examRisks']
    data.examToRisk.forEach(etr => {
      if (etr.risk) examRisks.push({
        requirements: new ExamRequirementsVO(etr),
        risk: RiskMapper.toModel(etr.risk),
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
