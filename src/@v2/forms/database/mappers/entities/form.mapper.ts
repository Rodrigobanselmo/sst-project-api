import { FormEntity } from '@/@v2/forms/domain/entities/form.entity';
import { FormTypeEnum } from '@/@v2/forms/domain/enums/form-type.enum';
import { Form as PrismaForm } from '@prisma/client';

export type FormEntityMapperConstructor = PrismaForm;

export class FormEntityMapper {
  static toEntity(prisma: FormEntityMapperConstructor): FormEntity {
    return new FormEntity({
      id: prisma.id,
      companyId: prisma.company_id,
      name: prisma.name,
      createdAt: prisma.created_at,
      description: prisma.description || undefined,
      updatedAt: prisma.updated_at,
      anonymous: prisma.anonymous,
      shareableLink: prisma.shareable_link,
      system: prisma.system,
      type: FormTypeEnum[prisma.type],
    });
  }

  static toArray(prisma: FormEntityMapperConstructor[]) {
    return prisma.map((p: FormEntityMapperConstructor) => FormEntityMapper.toEntity(p));
  }
}
