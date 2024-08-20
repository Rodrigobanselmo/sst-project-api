import { RiskFactorData, RiskFactors } from '@prisma/client';
import { RiskDataEntity } from '../../domain/entities/risk-data.entity';
import { RiskEntity } from '../../domain/entities/risk.entity';

export type IRiskDataModel = RiskFactorData & {
  riskFactor: RiskFactors
}

export class RiskDataModel {
  static toEntity(data: IRiskDataModel): RiskDataEntity {
    return new RiskDataEntity({
      risk: new RiskEntity({
        id: data.riskFactor.id,
        name: data.riskFactor.name,
      }),
    })
  }

  static toEntities(data: IRiskDataModel[]): RiskDataEntity[] {
    return data.map(RiskData => this.toEntity(RiskData))
  }
}
