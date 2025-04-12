import { FormParticipantsHierarchyEntity } from '@/@v2/forms/domain/entities/form-participants-hierarchy.entity';
import { FormParticipantsHierarchy as PrismaFormParticipantsHierarchy } from '@prisma/client';

export type FormParticipantsHierarchiesEntityMapperConstructor = PrismaFormParticipantsHierarchy;

export class FormParticipantsHierarchiesEntityMapper {
  static toEntity(prisma: FormParticipantsHierarchiesEntityMapperConstructor): FormParticipantsHierarchyEntity {
    return new FormParticipantsHierarchyEntity({
      createdAt: prisma.created_at,
      id: prisma.id,
      updatedAt: prisma.updated_at,
      hierarchyId: prisma.hierarchy_id,
    });
  }

  static toArray(prisma: FormParticipantsHierarchiesEntityMapperConstructor[]) {
    return prisma.map((p: FormParticipantsHierarchiesEntityMapperConstructor) => FormParticipantsHierarchiesEntityMapper.toEntity(p));
  }
}
