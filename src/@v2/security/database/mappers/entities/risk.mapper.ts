import { RiskFactors } from '@prisma/client';
import { IRiskAggregate, RiskAggregate } from '../../../domain/aggregate/risk.aggregate';
import { RiskEntity } from '../../../domain/entities/risk.entity';

type IRiskEntityMapper = RiskFactors
type IRiskAggregateMapper = IRiskEntityMapper & Omit<IRiskAggregate, 'entity'>

export class RiskMapper {
  static toEntity(data: IRiskEntityMapper): RiskEntity {
    return new RiskEntity(data)
  }

  static toAggregate(data: IRiskAggregateMapper): RiskAggregate {
    return new RiskAggregate({
      recomendations: () => Promise.resolve([]),
      entity: RiskMapper.toEntity(data),
    })
  }
}
