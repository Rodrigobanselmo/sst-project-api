import { FormStatusEnum } from '../../enums/form-status.enum';
import { FormQuestionGroupReadModel } from '../shared/form-question-group-read.model';

export type IFormApplicationReadModel = {
  id: string;
  name: string;
  companyId: string;
  description: string | undefined;
  createdAt: Date;
  updatedAt: Date;
  startedAt: Date | null;
  endedAt: Date | null;
  form: { id: string; name: string };
  status: FormStatusEnum;
  participants: {
    hierarchies: { id: string; name: string }[];
    workspaces: { id: string; name: string }[];
  };
  questionIdentifierGroup: FormQuestionGroupReadModel;
  isShareableLink: boolean;
  isAnonymous: boolean;
};

export class FormApplicationReadModel {
  id: string;
  companyId: string;
  name: string;
  description: string | undefined;
  createdAt: Date;
  updatedAt: Date;
  startedAt: Date | null;
  endedAt: Date | null;
  status: FormStatusEnum;
  form: { id: string; name: string };
  isShareableLink: boolean;
  isAnonymous: boolean;
  participants: {
    hierarchies: { id: string; name: string }[];
    workspaces: { id: string; name: string }[];
  };
  questionIdentifierGroup: FormQuestionGroupReadModel;

  constructor(params: IFormApplicationReadModel) {
    this.id = params.id;
    this.companyId = params.companyId;
    this.isShareableLink = params.isShareableLink;
    this.name = params.name;
    this.description = params.description;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
    this.status = params.status;
    this.startedAt = params.startedAt;
    this.endedAt = params.endedAt;
    this.form = params.form;
    this.participants = params.participants;
    this.questionIdentifierGroup = params.questionIdentifierGroup;
  }
}
