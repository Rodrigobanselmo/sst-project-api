import { FormParticipantsAnswersAggregate } from '@/@v2/forms/domain/aggregates/form-participant-answers.aggregate';

export namespace IFormParticipantsAnswersAggregateRepository {
  export type CreateParams = FormParticipantsAnswersAggregate;
  export type CreateReturn = Promise<boolean>;

  export type FindParams = { id: string; companyId: string };
  export type FindReturn = Promise<FormParticipantsAnswersAggregate | null>;

  export type FindManyParams = { formApplicationId: string; companyId: string };
  export type FindManyReturn = Promise<FormParticipantsAnswersAggregate[]>;
}
