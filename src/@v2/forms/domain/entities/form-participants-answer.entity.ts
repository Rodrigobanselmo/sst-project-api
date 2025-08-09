import { generateCuid } from '@/@v2/shared/utils/helpers/generate-cuid';
import { FormParticipantsAnswerStatusEnum } from '../enums/form-participants-answer-status.enum';

export type FormParticipantsAnswersEntityConstructor = {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  employeeId?: number;
  status?: FormParticipantsAnswerStatusEnum;
};

export class FormParticipantsAnswersEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  employeeId?: number;
  status: FormParticipantsAnswerStatusEnum;

  constructor(params: FormParticipantsAnswersEntityConstructor) {
    this.id = params.id ?? generateCuid();
    this.createdAt = params.createdAt ?? new Date();
    this.updatedAt = params.updatedAt ?? new Date();
    this.employeeId = params.employeeId;
    this.status = params.status ?? FormParticipantsAnswerStatusEnum.VALID;
  }
}
