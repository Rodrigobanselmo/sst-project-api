import { FormParticipantsAnswersAggregate } from '@/@v2/forms/domain/aggregates/form-participant-answers.aggregate';
import { FormParticipantsAnswers as PrismaFormParticipantsAnswers, FormAnswer as PrismaFormAnswer, FormApplication as PrismaFormApplication } from '@prisma/client';
import { FormParticipantsAnswersEntityMapper } from '../entities/form-participants-answers.mapper';
import { FormApplicationEntityMapper } from '../entities/form-application.mapper';
import { FormAnswerEntityMapper } from '../entities/form-answer.mapper';

export type FormParticipantsAnswersAggregateMapperConstructor = PrismaFormParticipantsAnswers & {
  form_application: PrismaFormApplication;
  answers: PrismaFormAnswer[];
};

export class FormParticipantsAnswersAggregateMapper {
  static toAggregate(prisma: FormParticipantsAnswersAggregateMapperConstructor): FormParticipantsAnswersAggregate {
    return new FormParticipantsAnswersAggregate({
      participant: FormParticipantsAnswersEntityMapper.toEntity(prisma),
      application: FormApplicationEntityMapper.toEntity(prisma.form_application),
      answers: FormAnswerEntityMapper.toArray(prisma.answers),
    });
  }

  static toArray(prisma: FormParticipantsAnswersAggregateMapperConstructor[]) {
    return prisma.map((p: FormParticipantsAnswersAggregateMapperConstructor) => FormParticipantsAnswersAggregateMapper.toAggregate(p));
  }
}
