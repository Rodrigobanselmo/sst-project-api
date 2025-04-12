import { FormQuestionCOPSOQEntity } from '@/@v2/forms/domain/entities/form-question-copsoq.entity';
import { FormCOPSOQCategoryEnum } from '@/@v2/forms/domain/enums/form-copsoq-category.enum';
import { FormCOPSOQDimensionEnum } from '@/@v2/forms/domain/enums/form-copsoq-dimension.enum';
import { FormCOPSOQLevelEnum } from '@/@v2/forms/domain/enums/form-copsoq-level.enum';
import { FormQuestionCOPSOQ as PrismaFormQuestionCOPSOQ } from '@prisma/client';

export type FormQuestionCOPSOQEntityMapperConstructor = PrismaFormQuestionCOPSOQ;

export class FormQuestionCOPSOQEntityMapper {
  static toEntity(prisma: FormQuestionCOPSOQEntityMapperConstructor): FormQuestionCOPSOQEntity {
    return new FormQuestionCOPSOQEntity({
      id: prisma.id,
      category: FormCOPSOQCategoryEnum[prisma.category],
      dimension: FormCOPSOQDimensionEnum[prisma.dimension],
      item: prisma.item,
      level: FormCOPSOQLevelEnum[prisma.level],
      question: prisma.question,
    });
  }

  static toArray(prisma: FormQuestionCOPSOQEntityMapperConstructor[]) {
    return prisma.map((p: FormQuestionCOPSOQEntityMapperConstructor) => FormQuestionCOPSOQEntityMapper.toEntity(p));
  }
}
