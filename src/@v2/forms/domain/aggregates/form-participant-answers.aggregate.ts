import { FormAnswerEntity } from '../entities/form-answer.entity';
import { FormApplicationEntity } from '../entities/form-application.entity';
import { FormParticipantsEntity } from '../entities/form-participants.entity';

export type IFormParticipantsAnswersAggregate = {
  participant: FormParticipantsEntity;
  application: FormApplicationEntity;
  answers: FormAnswerEntity[];
};

export class FormParticipantsAnswersAggregate {
  participant: FormParticipantsEntity;
  application: FormApplicationEntity;
  answers: FormAnswerEntity[];

  constructor(params: IFormParticipantsAnswersAggregate) {
    this.participant = params.participant;
    this.application = params.application;
    this.answers = params.answers;
  }
}
