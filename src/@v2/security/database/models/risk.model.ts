import { RiskFactors } from '@prisma/client';
import { IRiskAggregateRelations, RiskAggregate } from '../../domain/aggregate/risk.aggregate';

type IRiskModel = RiskFactors & IRiskAggregateRelations

export class RiskModel {
  static toEntity(data: IRiskModel): RiskAggregate {
    return new RiskAggregate({
      ...data,
    })
  }
}
