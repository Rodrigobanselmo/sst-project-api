import { FormQuestionEntity } from '@/@v2/forms/domain/entities/form-question.entity';
import { FormQuestion as PrismaFormQuestion, FormQuestionData as PrismaFormQuestionData } from '@prisma/client';

export type FormQuestionEntityMapperConstructor = PrismaFormQuestion & {
  data: PrismaFormQuestionData[];
};

export class FormQuestionEntityMapper {
  static toEntity(prisma: FormQuestionEntityMapperConstructor): FormQuestionEntity {
    const questionData = prisma.data[0]; // Get the first data entry

    if (!questionData) {
      throw new Error('FormQuestion must have at least one data entry');
    }

    return new FormQuestionEntity({
      id: prisma.id,
      order: questionData.order,
      required: questionData.required,
      createdAt: prisma.created_at,
      deletedAt: prisma.deleted_at,
      groupId: prisma.question_group_id,
    });
  }

  static toArray(prisma: FormQuestionEntityMapperConstructor[]) {
    return prisma.map((p: FormQuestionEntityMapperConstructor) => FormQuestionEntityMapper.toEntity(p));
  }
}
