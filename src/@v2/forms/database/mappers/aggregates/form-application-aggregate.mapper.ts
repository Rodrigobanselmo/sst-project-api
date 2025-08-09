import { FormApplicationAggregate } from '@/@v2/forms/domain/aggregates/form-application.aggregate';
import {
  FormApplication as PrismaFormApplication,
  FormParticipantsHierarchy as PrismaFormParticipantsHierarchy,
  FormParticipantsWorkspace as PrismaFormParticipantsWorkspace,
  FormParticipants as PrismaFormParticipants,
} from '@prisma/client';
import { FormApplicationEntityMapper } from '../entities/form-application.mapper';
import { FormEntityMapper, FormEntityMapperConstructor } from '../entities/form.mapper';
import { FormQuestionIdentifierGroupAggregateMapper, FormQuestionIdentifierGroupAggregateMapperConstructor } from './form-question-identifier-group-aggregate.mapper';
import { FormParticipantsAggregateMapper } from './form-participants-aggregate.mapper';

export type FormApplicationAggregateMapperConstructor = PrismaFormApplication & {
  form: FormEntityMapperConstructor;
  participants:
    | (PrismaFormParticipants & {
        workspaces: PrismaFormParticipantsWorkspace[];
        hierarchies: PrismaFormParticipantsHierarchy[];
      })
    | null;
  question_identifier_group: FormQuestionIdentifierGroupAggregateMapperConstructor[];
};

export class FormApplicationAggregateMapper {
  static toAggregate(prisma: FormApplicationAggregateMapperConstructor): FormApplicationAggregate {
    if (!prisma.participants) {
      throw new Error('Participants are required');
    }

    return new FormApplicationAggregate({
      formApplication: FormApplicationEntityMapper.toEntity(prisma),
      form: FormEntityMapper.toEntity(prisma.form),
      participants: FormParticipantsAggregateMapper.toAggregate(prisma.participants),
      identifier: FormQuestionIdentifierGroupAggregateMapper.toAggregate(prisma.question_identifier_group[0]!),
    });
  }

  static toArray(prisma: FormApplicationAggregateMapperConstructor[]) {
    return prisma.map((p: FormApplicationAggregateMapperConstructor) => FormApplicationAggregateMapper.toAggregate(p));
  }
}
