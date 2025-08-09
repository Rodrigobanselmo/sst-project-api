import { FormQuestionOptionEntity } from '@/@v2/forms/domain/entities/form-question-option.entity';
import { FormQuestionOption as PrismaFormQuestionOption, FormQuestionOptionData as PrismaFormQuestionOptionData } from '@prisma/client';

export type FormQuestionOptionEntityMapperConstructor = PrismaFormQuestionOption & {
  data: PrismaFormQuestionOptionData[];
};

export class FormQuestionOptionEntityMapper {
  static toEntity(prisma: FormQuestionOptionEntityMapperConstructor): FormQuestionOptionEntity {
    const optionData = prisma.data[0]; // Get the first data entry

    if (!optionData) {
      throw new Error('FormQuestionOption must have at least one data entry');
    }

    return new FormQuestionOptionEntity({
      id: prisma.id,
      order: optionData.order,
      text: optionData.text,
      value: optionData.value,
      createdAt: prisma.created_at,
      deletedAt: prisma.deleted_at,
    });
  }

  static toArray(prisma: FormQuestionOptionEntityMapperConstructor[]) {
    return prisma.map((p: FormQuestionOptionEntityMapperConstructor) => FormQuestionOptionEntityMapper.toEntity(p));
  }
}
