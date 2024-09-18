import { HomoTypeEnum } from '@/@v2/shared/domain/enum/security/homo-type.enum';
import { HierarchyOnHomogeneous, HomogeneousGroup } from '@prisma/client';
import { HierarchyGroupModel } from '../../domain/models/hierarchy-groups.model';
import { HomogeneousGroupModel } from '../../domain/models/homogeneous-group.model';
import { CharacterizationMapper, ICharacterizationMapper } from './characterization.mapper';
import { IRiskDataMapper, RiskDataMapper } from './risk-data.mapper';

export type IHomogeneousGroupMapper = HomogeneousGroup & {
  riskFactorData: IRiskDataMapper[]
  characterization: ICharacterizationMapper | null
  hierarchyOnHomogeneous: HierarchyOnHomogeneous[]
}

export class HomogeneousGroupMapper {
  static toModel(data: IHomogeneousGroupMapper): HomogeneousGroupModel {
    return new HomogeneousGroupModel({
      id: data.id,
      name: data.name,
      type: data.type as HomoTypeEnum,
      companyId: data.companyId,
      description: data.description,
      hierarchies: data.hierarchyOnHomogeneous.map(hierarchyGroup => new HierarchyGroupModel({
        endDate: hierarchyGroup.endDate,
        hierarchyId: hierarchyGroup.hierarchyId,
        homogeneousGroupId: hierarchyGroup.homogeneousGroupId,
        startDate: hierarchyGroup.startDate,
      })),
      risksData: RiskDataMapper.toModels(data.riskFactorData),
      characterization: data.characterization ? CharacterizationMapper.toModel(data.characterization) : null,

    })
  }

  static toModels(data: IHomogeneousGroupMapper[]): HomogeneousGroupModel[] {
    return data.map(HomogeneousGroup => this.toModel(HomogeneousGroup))
  }
}
