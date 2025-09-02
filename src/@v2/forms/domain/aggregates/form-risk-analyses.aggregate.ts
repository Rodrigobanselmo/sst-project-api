import { FormAnswerEntity } from '../entities/form-answer.entity';
import { FormApplicationEntity } from '../entities/form-application.entity';
import { FormParticipantsAnswersEntity } from '../entities/form-participants-answer.entity';
import { FormQuestionGroupEntity } from '../entities/form-question-group.entity';
import { FormEntity } from '../entities/form.entity';
import { FormQuestionAggregate } from './form-question.aggregate';

export type IFormRiskAnalysesAggregate = {
  formApplication: FormApplicationEntity;
  form: FormEntity;
  identifier: {
    questionGroup: FormQuestionGroupEntity;
    questions: FormQuestionAggregate[];
  };
  answers: FormAnswerEntity[];
  participantsAnswers: FormParticipantsAnswersEntity[];
  questionGroups: {
    questionGroup: FormQuestionGroupEntity;
    questions: FormQuestionAggregate[];
  }[];
};

export class FormRiskAnalysesAggregate {
  formApplication: FormApplicationEntity;
  form: {
    entity: FormEntity;
    questionGroups: {
      questionGroup: FormQuestionGroupEntity;
      questions: FormQuestionAggregate[];
    }[];
  };
  identifier: {
    questionGroup: FormQuestionGroupEntity;
    questions: FormQuestionAggregate[];
  };
  participantsAnswers: {
    answers: FormAnswerEntity[];
  }[];

  constructor(params: IFormRiskAnalysesAggregate) {
    // this.formApplication = params.formApplication;
    // this.form = {
    //   entity: params.form,
    //   // questionGroups: params.form.questionGroups,
    // };
    // this.identifier = {
    //   questionGroup: params.identifier.questionGroup,
    //   questions: params.identifier.questions,
    // };
    // this.participantsAnswers = params.participantsAnswers;
  }
}
