import { CharacterizationTypeEnum as PrismaCharacterizationTypeEnum, RecMed } from '@prisma/client';
import { CharacterizationTypeEnum } from '@/@v2/shared/domain/enum/security/characterization-type.enum';
import { CharacterizationBrowseFilterModel } from '@/@v2/security/domain/models/characterization-browse-filter.model';

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
