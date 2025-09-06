import { FormStatusEnum } from '../enums/form-status.enum';
import { FormParticipantsAnswerStatusEnum } from '../enums/form-participants-answer-status.enum';

export const getParticiantAnswersStatus = (formStatus: FormStatusEnum) => {
  return formStatus === FormStatusEnum.TESTING ? FormParticipantsAnswerStatusEnum.TESTING : FormParticipantsAnswerStatusEnum.VALID;
};
