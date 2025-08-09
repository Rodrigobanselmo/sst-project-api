import { FormQuestionDetailsEntity } from '@/@v2/forms/domain/entities/form-question-details.entity';
import { FormQuestionTypeEnum } from '@/@v2/forms/domain/enums/form-question-type.enum';
import { FormQuestionDetails, FormQuestionDetailsData } from '@prisma/client';

export type FormQuestionDetailsEntityMapperConstructor = FormQuestionDetails & {
  data: FormQuestionDetailsData[];
};

export class FormQuestionDetailsEntityMapper {
  static toEntity(prisma: FormQuestionDetailsEntityMapperConstructor): FormQuestionDetailsEntity {
    const detailsData = prisma.data[0];

    if (!detailsData) {
      throw new Error('FormQuestionDetails must have at least one data entry');
    }

    return new FormQuestionDetailsEntity({
      id: prisma.id,
      companyId: prisma.company_id,
      text: detailsData.text,
      type: FormQuestionTypeEnum[detailsData.type],
      acceptOther: detailsData.accept_other,
      system: prisma.system,
      createdAt: prisma.created_at,
      deletedAt: prisma.deleted_at,
    });
  }

  static toArray(prisma: FormQuestionDetailsEntityMapperConstructor[]) {
    return prisma.map((p: FormQuestionDetailsEntityMapperConstructor) => FormQuestionDetailsEntityMapper.toEntity(p));
  }
}
