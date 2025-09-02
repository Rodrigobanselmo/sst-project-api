import { FormQuestionRiskEntity } from '@/@v2/forms/domain/entities/form-question-risk.entity';
import { FormQuestionRisk } from '@prisma/client';

export type FormQuestionRiskEntityMapperConstructor = FormQuestionRisk;

export class FormQuestionRiskEntityMapper {
  static toEntity(prisma: FormQuestionRiskEntityMapperConstructor): FormQuestionRiskEntity {
    return new FormQuestionRiskEntity({
      id: prisma.id,
      questionId: prisma.question_Id,
      riskId: prisma.risk_id,
    });
  }

  static toArray(prisma: FormQuestionRiskEntityMapperConstructor[]) {
    return prisma.map((p: FormQuestionRiskEntityMapperConstructor) => FormQuestionRiskEntityMapper.toEntity(p));
  }
}
