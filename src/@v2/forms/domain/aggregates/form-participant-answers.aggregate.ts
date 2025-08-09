import { FormAnswerEntity } from '../entities/form-answer.entity';
import { FormApplicationEntity } from '../entities/form-application.entity';
import { FormParticipantsAnswerStatusEnum } from '../enums/form-participants-answer-status.enum';
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
  status: FormParticipantsAnswerStatusEnum;

  constructor(params: IFormParticipantsAnswersAggregate) {
    this.participant = params.participant;
    this.application = params.application;
    this.answers = params.answers;
    this.status = params.application.isTesting ? FormParticipantsAnswerStatusEnum.TESTING : FormParticipantsAnswerStatusEnum.VALID;
  }
}
