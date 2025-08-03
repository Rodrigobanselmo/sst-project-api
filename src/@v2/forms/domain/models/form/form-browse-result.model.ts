import { FormTypeEnum } from '../../enums/form-type.enum';

export type IFormBrowseResultModel = {
  id: number;
  name: string;
  description: string | undefined;
  companyId: string;
  type: FormTypeEnum;
  anonymous: boolean;
  system: boolean;
  shareableLink: boolean;
  updatedAt: Date;
  createdAt: Date;
};

export class FormBrowseResultModel {
  id: number;
  name: string;
  description: string | undefined;
  companyId: string;
  type: FormTypeEnum;
  anonymous: boolean;
  system: boolean;
  shareableLink: boolean;
  updatedAt: Date;
  createdAt: Date;

  constructor(params: IFormBrowseResultModel) {
    this.id = params.id;
    this.companyId = params.companyId;
    this.name = params.name;
    this.type = params.type;
    this.anonymous = params.anonymous;
    this.system = params.system;
    this.shareableLink = params.shareableLink;
    this.description = params.description;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
  }
}
