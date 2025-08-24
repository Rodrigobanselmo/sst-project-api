import { FormStatusEnum } from '../../enums/form-status.enum';
import { FormTypeEnum } from '../../enums/form-type.enum';

type IFormResultModel = {
  id: string;
  name: string;
  type: FormTypeEnum;
  system: boolean;
};

export type IFormApplicationBrowseResultModel = {
  id: string;
  name: string;
  description: string | undefined;
  status: FormStatusEnum;
  endDate: Date | undefined;
  startDate: Date | undefined;
  createdAt: Date;
  updatedAt: Date;
  companyId: string;
  totalAnswers: number;
  totalParticipants: number;
  averageTimeSpent: number | null;
  form: IFormResultModel;
};

export class FormApplicationBrowseResultModel {
  id: string;
  name: string;
  description: string | undefined;
  status: FormStatusEnum;
  endDate: Date | undefined;
  startDate: Date | undefined;
  createdAt: Date;
  updatedAt: Date;
  companyId: string;
  totalAnswers: number;
  totalParticipants: number;
  averageTimeSpent: number | null;
  form: IFormResultModel;

  constructor(params: IFormApplicationBrowseResultModel) {
    this.id = params.id;
    this.name = params.name;
    this.description = params.description;
    this.status = params.status;
    this.endDate = params.endDate;
    this.startDate = params.startDate;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
    this.companyId = params.companyId;

    this.totalParticipants = params.totalParticipants;
    this.totalAnswers = params.totalAnswers;
    this.averageTimeSpent = params.averageTimeSpent;
    this.form = params.form;
  }
}
