import { FormParticipantsAnswersAggregate } from '@/@v2/forms/domain/aggregates/form-participant-answers.aggregate';

export namespace IFormParticipantsAnswersRepository {
  export type CreateParams = FormParticipantsAnswersAggregate;
}
