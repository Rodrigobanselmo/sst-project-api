import { HomogeneousGroup } from '@prisma/client';
import { HomogeneousGroupEntity } from '../../domain/entities/homogeneous-group.entity';
import { HomoTypeEnum } from '@/@v2/shared/domain/enum/security/homo-type.enum';
import { IRiskDataModel, RiskDataModel } from './risk-data.model';

type IHomogeneousGroupModel = HomogeneousGroup & {
  riskFactorData: IRiskDataModel[]
}

export class HomogeneousGroupModel {
  static toEntity(data: IHomogeneousGroupModel): HomogeneousGroupEntity {
    return new HomogeneousGroupEntity({
      id: data.id,
      name: data.name,
      type: data.type as HomoTypeEnum,
      risksData: RiskDataModel.toEntities(data.riskFactorData)

    })
  }

  static toEntities(data: IHomogeneousGroupModel[]): HomogeneousGroupEntity[] {
    return data.map(HomogeneousGroup => this.toEntity(HomogeneousGroup))
  }
}
