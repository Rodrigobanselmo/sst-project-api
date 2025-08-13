import { FormAnswerEntity } from '@/@v2/forms/domain/entities/form-answer.entity';
import { FormAnswer as PrismaFormAnswer, FormAnswerOption as PrismaFormAnswerOption } from '@prisma/client';

export type FormAnswerEntityMapperConstructor = PrismaFormAnswer & {
  options: PrismaFormAnswerOption[];
};

export class FormAnswerEntityMapper {
  static toEntity(prisma: FormAnswerEntityMapperConstructor): FormAnswerEntity {
    return new FormAnswerEntity({
      id: prisma.id,
      value: prisma.value || undefined,
      createdAt: prisma.created_at,
      updatedAt: prisma.updated_at,
      questionId: prisma.question_id,
      optionIds: prisma.options.map((option) => option.option_id),
    });
  }

  static toArray(prisma: FormAnswerEntityMapperConstructor[]) {
    return prisma.map((p: FormAnswerEntityMapperConstructor) => FormAnswerEntityMapper.toEntity(p));
  }
}
