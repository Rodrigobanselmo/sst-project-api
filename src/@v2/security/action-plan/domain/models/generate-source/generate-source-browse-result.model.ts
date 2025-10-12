import { RiskTypeEnum } from '@/@v2/shared/domain/enum/security/risk-type.enum';

export type IGenerateSourceBrowseResultModel = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  risk: {
    id: string;
    name: string;
    type: RiskTypeEnum;
  };
};

export class GenerateSourceBrowseResultModel {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  risk: {
    id: string;
    name: string;
    type: RiskTypeEnum;
  };

  constructor(params: IGenerateSourceBrowseResultModel) {
    this.id = params.id;
    this.name = params.name;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
    this.risk = params.risk;
  }
}
