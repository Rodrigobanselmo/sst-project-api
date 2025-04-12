import { FormAnswerEntity } from '@/@v2/forms/domain/entities/form-answer.entity';
import { FormAnswer as PrismaFormAnswer } from '@prisma/client';

export type FormAnswerEntityMapperConstructor = PrismaFormAnswer;

export class FormAnswerEntityMapper {
  static toEntity(prisma: FormAnswerEntityMapperConstructor): FormAnswerEntity {
    return new FormAnswerEntity({
      id: prisma.id,
      value: prisma.value || undefined,
      createdAt: prisma.created_at,
      updatedAt: prisma.updated_at,
    });
  }

  static toArray(prisma: FormAnswerEntityMapperConstructor[]) {
    return prisma.map((p: FormAnswerEntityMapperConstructor) => FormAnswerEntityMapper.toEntity(p));
  }
}
