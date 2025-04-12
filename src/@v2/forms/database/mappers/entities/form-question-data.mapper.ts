import { FormQuestionDataEntity } from '@/@v2/forms/domain/entities/form-question-data.entity';
import { FormQuestionTypeEnum } from '@/@v2/forms/domain/enums/form-question-type.enum';
import { FormQuestionData as PrismaFormQuestionData } from '@prisma/client';

export type FormQuestionDataEntityMapperConstructor = PrismaFormQuestionData;

export class FormQuestionDataEntityMapper {
  static toEntity(prisma: FormQuestionDataEntityMapperConstructor): FormQuestionDataEntity {
    return new FormQuestionDataEntity({
      id: prisma.id,
      companyId: prisma.company_id,
      text: prisma.text,
      type: FormQuestionTypeEnum[prisma.type],
      acceptOther: prisma.accept_other,
      system: prisma.system,
      createdAt: prisma.created_at,
      updatedAt: prisma.updated_at,
    });
  }

  static toArray(prisma: FormQuestionDataEntityMapperConstructor[]) {
    return prisma.map((p: FormQuestionDataEntityMapperConstructor) => FormQuestionDataEntityMapper.toEntity(p));
  }
}
