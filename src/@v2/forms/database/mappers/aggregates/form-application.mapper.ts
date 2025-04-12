import { FormApplicationAggregate } from '@/@v2/forms/domain/aggregates/form-application.aggregate';
import { FormApplication as PrismaFormApplication, FormParticipantsHierarchy as PrismaFormParticipantsHierarchy, FormParticipantsWorkspace as PrismaFormParticipantsWorkspace } from '@prisma/client';
import { FormApplicationEntityMapper } from '../entities/form-application.mapper';
import { FormParticipantsHierarchiesEntityMapper } from '../entities/form-participants-hierarchies.mapper';
import { FormParticipantsWorkspaceEntityMapper } from '../entities/form-participants-workspace.mapper';
import { FormEntityMapper, FormEntityMapperConstructor } from '../entities/form.mapper';
import { FormQuestionIdentifierGroupAggregateMapper, FormQuestionIdentifierGroupAggregateMapperConstructor } from './form-question-identifier-group.mapper';

type NewType = {
  form: FormEntityMapperConstructor;
  participants: {
    workspaces: PrismaFormParticipantsWorkspace[];
    hierarchies: PrismaFormParticipantsHierarchy[];
  } | null;
  question_identifier_group: FormQuestionIdentifierGroupAggregateMapperConstructor;
};

export type FormApplicationAggregateMapperConstructor = PrismaFormApplication & NewType;

export class FormApplicationAggregateMapper {
  static toAggregate(prisma: FormApplicationAggregateMapperConstructor): FormApplicationAggregate {
    return new FormApplicationAggregate({
      formApplication: FormApplicationEntityMapper.toEntity(prisma),
      form: FormEntityMapper.toEntity(prisma.form),
      participantsHierarchies: FormParticipantsHierarchiesEntityMapper.toArray(prisma.participants?.hierarchies || []),
      participantsWorkspaces: FormParticipantsWorkspaceEntityMapper.toArray(prisma.participants?.workspaces || []),
      identifier: FormQuestionIdentifierGroupAggregateMapper.toAggregate(prisma.question_identifier_group),
    });
  }

  static toArray(prisma: FormApplicationAggregateMapperConstructor[]) {
    return prisma.map((p: FormApplicationAggregateMapperConstructor) => FormApplicationAggregateMapper.toAggregate(p));
  }
}
