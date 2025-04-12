import { FormParticipantsEntity } from '@/@v2/forms/domain/entities/form-participants.entity';
import { FormParticipants as PrismaFormParticipants } from '@prisma/client';

export type FormParticipantsEntityMapperConstructor = PrismaFormParticipants;

export class FormParticipantsEntityMapper {
  static toEntity(prisma: FormParticipantsEntityMapperConstructor): FormParticipantsEntity {
    return new FormParticipantsEntity({
      id: prisma.id,
      createdAt: prisma.created_at,
      updatedAt: prisma.updated_at,
    });
  }

  static toArray(prisma: FormParticipantsEntityMapperConstructor[]) {
    return prisma.map((p: FormParticipantsEntityMapperConstructor) => FormParticipantsEntityMapper.toEntity(p));
  }
}
