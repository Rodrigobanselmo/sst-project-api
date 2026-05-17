import { FormParticipantStructureBrowseModel } from './form-participant-structure-browse.model';
import { FormQuestionGroupWithAnswersBrowseModel } from './form-question-group-with-answers-browse.model';

export type IFormQuestionsAnswersBrowseModel = {
  results: FormQuestionGroupWithAnswersBrowseModel[];
  participantStructures?: FormParticipantStructureBrowseModel[];
};

export class FormQuestionsAnswersBrowseModel {
  results: FormQuestionGroupWithAnswersBrowseModel[];
  participantStructures: FormParticipantStructureBrowseModel[];

  constructor(params: IFormQuestionsAnswersBrowseModel) {
    this.results = params.results.sort((a, b) => a.order - b.order);
    this.participantStructures = params.participantStructures ?? [];
  }
}
