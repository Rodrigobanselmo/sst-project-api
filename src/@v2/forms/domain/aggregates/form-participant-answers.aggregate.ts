import { FormAnswerEntity } from '../entities/form-answer.entity';
import { FormApplicationEntity } from '../entities/form-application.entity';
import { FormParticipantsAggregate } from './form-participants.aggregate';

export type IFormParticipantsAnswersAggregate = {
  participant: FormParticipantsAggregate;
  application: FormApplicationEntity;
  answers: FormAnswerEntity[];
};

export class FormParticipantsAnswersAggregate {
  participant: FormParticipantsAggregate;
  application: FormApplicationEntity;
  answers: FormAnswerEntity[];

  constructor(params: IFormParticipantsAnswersAggregate) {
    this.participant = params.participant;
    this.application = params.application;
    this.answers = params.answers;
  }
}
