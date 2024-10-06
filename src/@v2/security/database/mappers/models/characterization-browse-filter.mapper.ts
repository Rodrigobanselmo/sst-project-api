import { CharacterizationBrowseFilterModel } from '@/@v2/security/domain/models/characterization-browse-filter.model';
import { CharacterizationTypeEnum } from '@/@v2/shared/domain/enum/security/characterization-type.enum';
import { CharacterizationTypeEnum as PrismaCharacterizationTypeEnum } from '@prisma/client';

export type ICharacterizationBrowseFilterModelMapper = {
  filter_types: PrismaCharacterizationTypeEnum[] | null;
}

export class CharacterizationBrowseFilterModelMapper {
  static toModel(prisma: ICharacterizationBrowseFilterModelMapper): CharacterizationBrowseFilterModel {
    return new CharacterizationBrowseFilterModel({
      types: prisma.filter_types?.map((type) => CharacterizationTypeEnum[type]) || [],
    })
  }
}
