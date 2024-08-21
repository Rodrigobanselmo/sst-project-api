import { RiskFactorData, RiskFactors } from '@prisma/client';
import { RiskDataModel } from '../../domain/models/risk-data.model';
import { RiskModel } from '../../domain/models/risk.model';

export type IRiskDataMapper = RiskFactorData & {
  riskFactor: RiskFactors
}

export class RiskDataMapper {
  static toModel(data: IRiskDataMapper): RiskDataModel {
    return new RiskDataModel({
      risk: new RiskModel({
        id: data.riskFactor.id,
        name: data.riskFactor.name,
      }),
    })
  }

  static toModels(data: IRiskDataMapper[]): RiskDataModel[] {
    return data.map(RiskData => this.toModel(RiskData))
  }
}
