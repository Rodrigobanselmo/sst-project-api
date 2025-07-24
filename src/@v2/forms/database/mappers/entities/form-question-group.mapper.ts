import { FormQuestionGroupEntity } from '@/@v2/forms/domain/entities/form-question-group.entity';
import { FormQuestionGroup as PrismaFormQuestionGroup, FormQuestionGroupData as PrismaFormQuestionGroupData } from '@prisma/client';

export type FormQuestionGroupEntityMapperConstructor = PrismaFormQuestionGroup & {
  data: PrismaFormQuestionGroupData[];
};

export class FormQuestionGroupEntityMapper {
  static toEntity(prisma: FormQuestionGroupEntityMapperConstructor): FormQuestionGroupEntity {
    const data = prisma.data[0];

    return new FormQuestionGroupEntity({
      id: prisma.id,
      name: data.name,
      description: data.description || undefined,
      order: data.order,
      createdAt: prisma.created_at,
      deletedAt: prisma.deleted_at,
      formId: prisma.form_id,
    });
  }

  static toArray(prisma: FormQuestionGroupEntityMapperConstructor[]) {
    return prisma.map((p: FormQuestionGroupEntityMapperConstructor) => FormQuestionGroupEntityMapper.toEntity(p));
  }
}
