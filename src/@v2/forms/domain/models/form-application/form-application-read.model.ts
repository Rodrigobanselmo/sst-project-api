import { FormTypeEnum } from '../../enums/form-type.enum';
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
  form: { id: string; name: string; type: FormTypeEnum };
  status: FormStatusEnum;
  participants: {
    hierarchies: { id: string; name: string }[];
    workspaces: { id: string; name: string }[];
  };
  questionIdentifierGroup: FormQuestionGroupReadModel;
  isShareableLink: boolean;
  participationGoal: number | null;
  isAnonymous: boolean;
  totalParticipants: number;
  totalAnswers: number;
  averageTimeSpent: number | null;
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
  form: { id: string; name: string; type: FormTypeEnum };
  isShareableLink: boolean;
  isAnonymous: boolean;
  participants: {
    hierarchies: { id: string; name: string }[];
    workspaces: { id: string; name: string }[];
  };
  totalParticipants: number;
  totalAnswers: number;
  averageTimeSpent: number | null;
  participationGoal: number | null;
  questionIdentifierGroup: FormQuestionGroupReadModel;

  constructor(params: IFormApplicationReadModel) {
    this.id = params.id;
    this.companyId = params.companyId;
    this.name = params.name;
    this.description = params.description;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
    this.status = params.status;
    this.startedAt = params.startedAt;
    this.endedAt = params.endedAt;
    this.form = params.form;
    this.participants = params.participants;
    this.isAnonymous = params.isAnonymous;
    this.isShareableLink = params.isShareableLink;
    this.questionIdentifierGroup = params.questionIdentifierGroup;
    this.totalParticipants = params.totalParticipants;
    this.totalAnswers = params.totalAnswers;
    this.participationGoal = params.participationGoal;
    this.averageTimeSpent = params.averageTimeSpent;
  }
}
