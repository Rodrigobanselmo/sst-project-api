import { FormParticipantsWorkspaceEntity } from '@/@v2/forms/domain/entities/form-participants-workspace.entity';
import { FormParticipantsWorkspace as PrismaFormParticipantsWorkspace, FormParticipantsAnswers as PrismaFormParticipantsAnswers } from '@prisma/client';

export type FormParticipantsWorkspaceEntityMapperConstructor = PrismaFormParticipantsWorkspace;

export class FormParticipantsWorkspaceEntityMapper {
  static toEntity(prisma: FormParticipantsWorkspaceEntityMapperConstructor): FormParticipantsWorkspaceEntity {
    return new FormParticipantsWorkspaceEntity({
      createdAt: prisma.created_at,
      id: prisma.id,
      updatedAt: prisma.updated_at,
      workspaceId: prisma.workspace_id,
    });
  }

  static toArray(prisma: FormParticipantsWorkspaceEntityMapperConstructor[]) {
    return prisma.map((p: FormParticipantsWorkspaceEntityMapperConstructor) => FormParticipantsWorkspaceEntityMapper.toEntity(p));
  }
}
