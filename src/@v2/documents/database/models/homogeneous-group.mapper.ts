import { HomogeneousGroup } from '@prisma/client';
import { HomogeneousGroupModel } from '../../domain/models/homogeneous-group.model';
import { HomoTypeEnum } from '@/@v2/shared/domain/enum/security/homo-type.enum';
import { IRiskDataMapper, RiskDataMapper } from './risk-data.mapper';

export type IHomogeneousGroupMapper = HomogeneousGroup & {
  riskFactorData: IRiskDataMapper[]
}

export class HomogeneousGroupMapper {
  static toModel(data: IHomogeneousGroupMapper): HomogeneousGroupModel {
    return new HomogeneousGroupModel({
      id: data.id,
      name: data.name,
      type: data.type as HomoTypeEnum,
      risksData: RiskDataMapper.toModels(data.riskFactorData)

    })
  }

  static toModels(data: IHomogeneousGroupMapper[]): HomogeneousGroupModel[] {
    return data.map(HomogeneousGroup => this.toModel(HomogeneousGroup))
  }
}
