import { FormQuestionIdentifierGroupEntity } from '@/@v2/forms/domain/entities/form-question-identifier-group.entity';
import { FormQuestionIdentifierGroup as PrismaFormQuestionIdentifierGroup } from '@prisma/client';

export type FormQuestionIdentifierGroupEntityMapperConstructor = PrismaFormQuestionIdentifierGroup;

export class FormQuestionIdentifierGroupEntityMapper {
  static toEntity(prisma: FormQuestionIdentifierGroupEntityMapperConstructor): FormQuestionIdentifierGroupEntity {
    return new FormQuestionIdentifierGroupEntity({
      id: prisma.id,
      name: prisma.name,
      description: prisma.description || undefined,
      createdAt: prisma.created_at,
      updatedAt: prisma.updated_at,
    });
  }

  static toArray(prisma: FormQuestionIdentifierGroupEntityMapperConstructor[]) {
    return prisma.map((p: FormQuestionIdentifierGroupEntityMapperConstructor) => FormQuestionIdentifierGroupEntityMapper.toEntity(p));
  }
}
