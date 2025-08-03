import { FormTypeEnum } from '../../enums/form-type.enum';
import { FormQuestionGroupReadModel } from '../shared/form-question-group-read.model';

export type IFormReadModel = {
  id: string;
  name: string;
  description: string | undefined;
  companyId: string;
  type: FormTypeEnum;
  system: boolean;
  anonymous: boolean;
  shareable_link: boolean;
  createdAt: Date;
  updatedAt: Date;
  questionGroups: FormQuestionGroupReadModel[];
};

export class FormReadModel {
  id: string;
  name: string;
  description: string | undefined;
  companyId: string;
  type: FormTypeEnum;
  anonymous: boolean;
  system: boolean;
  shareable_link: boolean;
  createdAt: Date;
  updatedAt: Date;
  questionGroups: FormQuestionGroupReadModel[];

  constructor(params: IFormReadModel) {
    this.id = params.id;
    this.companyId = params.companyId;
    this.name = params.name;
    this.type = params.type;
    this.anonymous = params.anonymous;
    this.system = params.system;
    this.shareable_link = params.shareable_link;
    this.description = params.description;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
    this.questionGroups = params.questionGroups.sort((a, b) => a.order - b.order);
  }
}
