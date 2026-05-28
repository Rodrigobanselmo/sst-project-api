import { FormApplicationRiskLogBrowseModel } from '@/@v2/forms/domain/models/form-application-risk-log/form-application-risk-log-browse.model';
import { FormApplicationRiskLog, RiskFactors, FormApplication, RiskFactorsEnum } from '@prisma/client';

export type IFormApplicationRiskLogBrowseModelMapper = {
  entity_id: string;
  probability: number;
  risk_id: string;
  existsInInventory?: boolean;
};

export class FormApplicationRiskLogBrowseModelMapper {
  static toModel(prisma: IFormApplicationRiskLogBrowseModelMapper): FormApplicationRiskLogBrowseModel {
    return new FormApplicationRiskLogBrowseModel({
      entityId: prisma.entity_id,
      probability: prisma.probability,
      riskId: prisma.risk_id,
      existsInInventory: prisma.existsInInventory ?? false,
    });
  }

  static toModels(prisma: IFormApplicationRiskLogBrowseModelMapper[]): FormApplicationRiskLogBrowseModel[] {
    return prisma.map((item) => FormApplicationRiskLogBrowseModelMapper.toModel(item));
  }
}
