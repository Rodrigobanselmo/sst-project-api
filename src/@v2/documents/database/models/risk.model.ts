import { RiskFactors } from '@prisma/client';
import { IRiskAggregate, RiskAggregate } from '../../domain/aggregate/risk.aggregate';
import { RiskEntity } from '../../domain/entities/risk.entity';

type IRiskModelEntity = RiskFactors
type IRiskModelAggregate = IRiskModelEntity & Omit<IRiskAggregate, 'entity'>

export class RiskModel {
  static toEntity(data: IRiskModelEntity): RiskEntity {
    return new RiskEntity(data)
  }

  static toAggregate(data: IRiskModelAggregate): RiskAggregate {
    return new RiskAggregate({
      ...data,
      entity: RiskModel.toEntity(data),
    })
  }
}
