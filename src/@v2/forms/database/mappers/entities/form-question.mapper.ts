import { FormQuestionEntity } from '@/@v2/forms/domain/entities/form-question.entity';
import { FormQuestion as PrismaFormQuestion } from '@prisma/client';

export type FormQuestionEntityMapperConstructor = PrismaFormQuestion;

export class FormQuestionEntityMapper {
  static toEntity(prisma: FormQuestionEntityMapperConstructor): FormQuestionEntity {
    return new FormQuestionEntity({
      id: prisma.id,
      order: prisma.order,
      createdAt: prisma.created_at,
      required: prisma.required,
      updatedAt: prisma.updated_at,
    });
  }

  static toArray(prisma: FormQuestionEntityMapperConstructor[]) {
    return prisma.map((p: FormQuestionEntityMapperConstructor) => FormQuestionEntityMapper.toEntity(p));
  }
}
