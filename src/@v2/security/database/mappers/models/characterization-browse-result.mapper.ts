import { CharacterizationBrowseResultModel } from '@/@v2/security/domain/models/characterization-browse-result.model';
import { HierarchyTypeEnum } from '@/@v2/shared/domain/enum/company/hierarchy-type.enum';
import { CharacterizationTypeEnum } from '@/@v2/shared/domain/enum/security/characterization-type.enum';
import { HierarchyEnum, CharacterizationTypeEnum as PrismaCharacterizationTypeEnum } from '@prisma/client';

export type ICharacterizationBrowseResultModelMapper = {
  id: string;
  created_at: Date;
  updated_at: Date;
  name: string;
  type: PrismaCharacterizationTypeEnum;
  done_at: string | null;
  order: number | null;
  filter_types: string[];
  profiles: {
    id: string;
    name: string;
  }[];
  hierarchies: {
    id: string;
    name: string;
    type: HierarchyEnum;
  }[];
  riskfactors: {
    id: string;
    name: string;
  }[];
  photos: {
    id: string;
    url: string;
  }[];
}

export class CharacterizationBrowseResultModelMapper {
  static toModel(prisma: ICharacterizationBrowseResultModelMapper): CharacterizationBrowseResultModel {
    return new CharacterizationBrowseResultModel({
      id: prisma.id,
      createdAt: prisma.created_at,
      updatedAt: prisma.updated_at,
      name: prisma.name,
      type: CharacterizationTypeEnum[prisma.type],
      doneAt: prisma.done_at,
      order: prisma.order,
      profiles: prisma.profiles.map((profile) => ({
        id: profile.id,
        name: profile.name,
      })),
      hierarchies: prisma.hierarchies.map((hierarchy) => ({
        id: hierarchy.id,
        name: hierarchy.name,
        type: HierarchyTypeEnum[hierarchy.type]
      })),
      risks: prisma.riskfactors.map((riskfactor) => ({
        id: riskfactor.id,
        name: riskfactor.name,
      })),
      photos: prisma.photos.map((photo) => ({
        id: photo.id,
        url: photo.url,
      })),
    })
  }

  static toModels(prisma: ICharacterizationBrowseResultModelMapper[]): CharacterizationBrowseResultModel[] {
    return prisma.map((rec) => CharacterizationBrowseResultModelMapper.toModel(rec))
  }
}
