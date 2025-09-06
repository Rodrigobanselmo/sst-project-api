import { RiskFactorsEnum } from '@prisma/client';

export type IFormApplicationRiskLogBrowseModel = {
  entityId: string;
  probability: number;
  riskId: string;
};

export class FormApplicationRiskLogBrowseModel {
  entityId: string;
  probability: number;
  riskId: string;
  constructor(params: IFormApplicationRiskLogBrowseModel) {
    this.entityId = params.entityId;
    this.probability = params.probability;
    this.riskId = params.riskId;
  }
}
