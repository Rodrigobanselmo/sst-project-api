import { FormApplicationEntity } from '@/@v2/forms/domain/entities/form-application.entity';
import { FormStatusEnum } from '@/@v2/forms/domain/enums/form-status.enum';
import { FormApplication as PrismaFormApplication } from '@prisma/client';

export type FormApplicationEntityMapperConstructor = PrismaFormApplication;

export class FormApplicationEntityMapper {
  static toEntity(prisma: FormApplicationEntityMapperConstructor): FormApplicationEntity {
    return new FormApplicationEntity({
      id: prisma.id,
      companyId: prisma.company_id,
      name: prisma.name,
      createdAt: prisma.created_at,
      description: prisma.description || undefined,
      updatedAt: prisma.updated_at,
      status: FormStatusEnum[prisma.status],
      endedAt: prisma.ended_at,
      startAt: prisma.started_at,
    });
  }

  static toArray(prisma: FormApplicationEntityMapperConstructor[]) {
    return prisma.map((p: FormApplicationEntityMapperConstructor) => FormApplicationEntityMapper.toEntity(p));
  }
}
