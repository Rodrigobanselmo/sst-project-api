export type IFormAnswerBrowseModel = {
  id: string;
  value?: string;
  participantsAnswersId: string;
  selectedOptionsIds: string[];
};

export class FormAnswerBrowseModel {
  id: string;
  value?: string;
  participantsAnswersId: string;
  selectedOptionsIds: string[];

  constructor(params: IFormAnswerBrowseModel) {
    this.id = params.id;
    this.value = params.value;
    this.participantsAnswersId = params.participantsAnswersId;
    this.selectedOptionsIds = params.selectedOptionsIds;
  }
}
