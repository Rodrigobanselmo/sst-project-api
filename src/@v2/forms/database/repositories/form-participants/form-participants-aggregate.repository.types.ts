import { FormParticipantsAggregate } from '@/@v2/forms/domain/aggregates/form-participants.aggregate';

export namespace IFormParticipantsAggregateRepository {
  export type FindParams = { id: string; companyId: string };
  export type FindReturn = Promise<FormParticipantsAggregate | null>;

  export type FindByFormApplicationIdParams = { formApplicationId: string; companyId: string | undefined };
  export type FindByFormApplicationIdReturn = Promise<FormParticipantsAggregate | null>;
}
