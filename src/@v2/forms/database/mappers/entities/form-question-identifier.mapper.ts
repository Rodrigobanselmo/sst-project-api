import { FormQuestionIdentifierEntity } from '@/@v2/forms/domain/entities/form-question-identifier.entity';
import { FormIdentifierTypeEnum } from '@/@v2/forms/domain/enums/form-identifier-type.enum';
import { FormQuestionIdentifier as PrismaFormQuestionIdentifier } from '@prisma/client';

export type FormQuestionIdentifierEntityMapperConstructor = PrismaFormQuestionIdentifier;

export class FormQuestionIdentifierEntityMapper {
  static toEntity(prisma: FormQuestionIdentifierEntityMapperConstructor): FormQuestionIdentifierEntity {
    return new FormQuestionIdentifierEntity({
      id: prisma.id,
      createdAt: prisma.created_at,
      updatedAt: prisma.updated_at,
      type: FormIdentifierTypeEnum[prisma.type],
      directAssociation: prisma.direct_association,
    });
  }

  static toArray(prisma: FormQuestionIdentifierEntityMapperConstructor[]) {
    return prisma.map((p: FormQuestionIdentifierEntityMapperConstructor) => FormQuestionIdentifierEntityMapper.toEntity(p));
  }
}
