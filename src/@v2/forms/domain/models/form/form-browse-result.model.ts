import { FormTypeEnum } from '../../enums/form-type.enum';

export type IFormBrowseResultModel = {
  id: number;
  name: string;
  description: string | undefined;
  companyId: string;
  type: FormTypeEnum;
  anonymous: boolean;
  system: boolean;
  shareable_link: boolean;
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
  shareable_link: boolean;
  updatedAt: Date;
  createdAt: Date;

  constructor(params: IFormBrowseResultModel) {
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
  }
}
