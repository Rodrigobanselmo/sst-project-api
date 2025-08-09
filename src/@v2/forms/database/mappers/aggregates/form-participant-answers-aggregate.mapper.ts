import { FormParticipantsAnswersAggregate } from '@/@v2/forms/domain/aggregates/form-participant-answers.aggregate';
import {
  FormParticipantsAnswers as PrismaFormParticipantsAnswers,
  FormAnswer as PrismaFormAnswer,
  FormApplication as PrismaFormApplication,
  FormParticipants as PrismaFormParticipants,
  FormParticipantsHierarchy as PrismaFormParticipantsHierarchy,
  FormParticipantsWorkspace as PrismaFormParticipantsWorkspace,
} from '@prisma/client';
import { FormApplicationEntityMapper } from '../entities/form-application.mapper';
import { FormAnswerEntityMapper } from '../entities/form-answer.mapper';
import { FormParticipantsAggregateMapper } from './form-participants-aggregate.mapper';

export type FormParticipantsAnswersAggregateMapperConstructor = PrismaFormParticipantsAnswers & {
  form_application: PrismaFormApplication & {
    participants:
      | (PrismaFormParticipants & {
          workspaces: PrismaFormParticipantsWorkspace[];
          hierarchies: PrismaFormParticipantsHierarchy[];
        })
      | null;
  };
  answers: PrismaFormAnswer[];
};

export class FormParticipantsAnswersAggregateMapper {
  static toAggregate(prisma: FormParticipantsAnswersAggregateMapperConstructor): FormParticipantsAnswersAggregate {
    if (!prisma.form_application.participants) {
      throw new Error('Participants are required for FormParticipantsAnswersAggregate');
    }

    return new FormParticipantsAnswersAggregate({
      participant: FormParticipantsAggregateMapper.toAggregate(prisma.form_application.participants),
      application: FormApplicationEntityMapper.toEntity(prisma.form_application),
      answers: FormAnswerEntityMapper.toArray(prisma.answers),
    });
  }

  static toArray(prisma: FormParticipantsAnswersAggregateMapperConstructor[]) {
    return prisma.map((p: FormParticipantsAnswersAggregateMapperConstructor) => FormParticipantsAnswersAggregateMapper.toAggregate(p));
  }
}
