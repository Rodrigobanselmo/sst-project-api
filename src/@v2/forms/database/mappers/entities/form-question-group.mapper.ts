import { FormQuestionGroupEntity } from '@/@v2/forms/domain/entities/form-question-group.entity';
import { FormQuestionGroup as PrismaFormQuestionGroup } from '@prisma/client';

export type FormQuestionGroupEntityMapperConstructor = PrismaFormQuestionGroup;

export class FormQuestionGroupEntityMapper {
  static toEntity(prisma: FormQuestionGroupEntityMapperConstructor): FormQuestionGroupEntity {
    return new FormQuestionGroupEntity({
      id: prisma.id,
      name: prisma.name,
      description: prisma.description || undefined,
      order: prisma.order,
      createdAt: prisma.created_at,
      updatedAt: prisma.updated_at,
      deletedAt: prisma.deleted_at,
      formId: prisma.form_id,
    });
  }

  static toArray(prisma: FormQuestionGroupEntityMapperConstructor[]) {
    return prisma.map((p: FormQuestionGroupEntityMapperConstructor) => FormQuestionGroupEntityMapper.toEntity(p));
  }
}
