import { CharacterizationBrowseFilterModel } from '@/@v2/security/characterization/domain/models/characterization/characterization-browse-filter.model';
import { CharacterizationTypeEnum } from '@/@v2/shared/domain/enum/security/characterization-type.enum';
import { CharacterizationTypeEnum as PrismaCharacterizationTypeEnum, Status as PrismaStatus } from '@prisma/client';

export type ICharacterizationBrowseFilterModelMapper = {
  filter_types: PrismaCharacterizationTypeEnum[] | null;
  stages: (PrismaStatus | null)[] | null;
}

export class CharacterizationBrowseFilterModelMapper {
  static toModel(prisma: ICharacterizationBrowseFilterModelMapper): CharacterizationBrowseFilterModel {
    return new CharacterizationBrowseFilterModel({
      types: prisma.filter_types?.map((type) => CharacterizationTypeEnum[type]) || [],
      stages: prisma.stages?.map((stage) => {
        if (!stage) return {
          id: 0,
          name: 'Sem Status',
          color: undefined,
        }

        return {
          id: stage.id,
          name: stage.name,
          color: stage.color || undefined,
        }
      }) || [],
    })
  }
}
