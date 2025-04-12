import { FormQuestionOptionEntity } from '@/@v2/forms/domain/entities/form-question-option.entity';
import { FormQuestionOption as PrismaFormQuestionOption } from '@prisma/client';

export type FormQuestionOptionEntityMapperConstructor = PrismaFormQuestionOption;

export class FormQuestionOptionEntityMapper {
  static toEntity(prisma: FormQuestionOptionEntityMapperConstructor): FormQuestionOptionEntity {
    return new FormQuestionOptionEntity({
      id: prisma.id,
      order: prisma.order,
      createdAt: prisma.created_at,
      updatedAt: prisma.updated_at,
      text: prisma.text,
      value: prisma.value,
    });
  }

  static toArray(prisma: FormQuestionOptionEntityMapperConstructor[]) {
    return prisma.map((p: FormQuestionOptionEntityMapperConstructor) => FormQuestionOptionEntityMapper.toEntity(p));
  }
}
