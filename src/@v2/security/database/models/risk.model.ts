import { RiskFactors } from '@prisma/client';
import { IRiskAggregate, RiskAggregate } from '../../domain/aggregate/risk.aggregate';
import { RiskEntity } from '../../domain/entities/risk.entity';

type IRiskEntityModel = RiskFactors
type IRiskAggregateModel = IRiskEntityModel & Omit<IRiskAggregate, 'entity'>

export class RiskModel {
  static toEntity(data: IRiskEntityModel): RiskEntity {
    return new RiskEntity(data)
  }

  static toAggregate(data: IRiskAggregateModel): RiskAggregate {
    return new RiskAggregate({
      recomendations: () => Promise.resolve([]),
      entity: RiskModel.toEntity(data),
    })
  }
}
