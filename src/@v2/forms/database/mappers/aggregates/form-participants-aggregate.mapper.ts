import { FormParticipantsAggregate } from '@/@v2/forms/domain/aggregates/form-participants.aggregate';
import { FormParticipants as PrismaFormParticipants, FormParticipantsHierarchy as PrismaFormParticipantsHierarchy, FormParticipantsWorkspace as PrismaFormParticipantsWorkspace } from '@prisma/client';
import { FormParticipantsEntityMapper } from '../entities/form-participants.mapper';
import { FormParticipantsHierarchiesEntityMapper } from '../entities/form-participants-hierarchies.mapper';
import { FormParticipantsWorkspaceEntityMapper } from '../entities/form-participants-workspace.mapper';

export type FormParticipantsAggregateMapperConstructor = PrismaFormParticipants & {
  workspaces: PrismaFormParticipantsWorkspace[];
  hierarchies: PrismaFormParticipantsHierarchy[];
};

export class FormParticipantsAggregateMapper {
  static toAggregate(prisma: FormParticipantsAggregateMapperConstructor): FormParticipantsAggregate {
    return new FormParticipantsAggregate({
      formParticipants: FormParticipantsEntityMapper.toEntity(prisma),
      participantsWorkspaces: FormParticipantsWorkspaceEntityMapper.toArray(prisma.workspaces || []),
      participantsHierarchies: FormParticipantsHierarchiesEntityMapper.toArray(prisma.hierarchies || []),
    });
  }

  static toArray(prisma: FormParticipantsAggregateMapperConstructor[]) {
    return prisma.map((p: FormParticipantsAggregateMapperConstructor) => FormParticipantsAggregateMapper.toAggregate(p));
  }
}
