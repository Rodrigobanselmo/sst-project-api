import { OriginPhotoModel } from '@/@v2/security/action-plan/domain/models/origin/origin-photo.model';
import { OriginModel } from '@/@v2/security/action-plan/domain/models/origin/origin.model';
import { HierarchyTypeEnum } from '@/@v2/shared/domain/enum/company/hierarchy-type.enum';
import { CharacterizationTypeEnum } from '@/@v2/shared/domain/enum/security/characterization-type.enum';
import { HomoTypeEnum } from '@/@v2/shared/domain/enum/security/homo-type.enum';
import { getOriginHomogeneousGroup } from '@/@v2/shared/domain/functions/security/get-origin-homogeneous-group.func';
import { CharacterizationTypeEnum as PrismaCharacterizationTypeEnum, CompanyCharacterizationPhoto, HomogeneousGroup, HierarchyEnum } from '@prisma/client';

export type IOriginMapper = {
  homogeneousGroup: Pick<HomogeneousGroup, 'companyId' | 'id' | 'name' | 'type'> & {
    hierarchyOnHomogeneous: {
      hierarchy: {
        name: string;
        type: HierarchyEnum;
      };
    }[];
    characterization: {
      name: string;
      type: PrismaCharacterizationTypeEnum;
      photos: CompanyCharacterizationPhoto[];
    } | null;
  };

  photos: {
    id: string;
    name: string;
    is_vertical: boolean;
    url: string;
    created_at: Date;
    deleted_at: Date | null;
    updated_at: Date;
    risk_data_rec_id: string;
  }[];
};

export class OriginMapper {
  static toModel({ homogeneousGroup, photos }: IOriginMapper): OriginModel {
    const origin = getOriginHomogeneousGroup({
      characterization: homogeneousGroup.characterization
        ? {
            name: homogeneousGroup.characterization.name,
            type: homogeneousGroup.characterization.type as CharacterizationTypeEnum,
          }
        : null,
      hierarchy: homogeneousGroup.hierarchyOnHomogeneous[0]?.hierarchy
        ? {
            name: homogeneousGroup.hierarchyOnHomogeneous[0].hierarchy.name,
            type: homogeneousGroup.hierarchyOnHomogeneous[0].hierarchy.type as HierarchyTypeEnum,
          }
        : null,
      name: homogeneousGroup.name,
      type: homogeneousGroup.type as HomoTypeEnum,
    });

    return new OriginModel({
      id: homogeneousGroup.id,
      name: origin.name,
      type: origin.type,
      companyId: homogeneousGroup.companyId,
      recommendationPhotos: photos.map(
        (photo) =>
          new OriginPhotoModel({
            id: photo.id,
            isVertical: photo.is_vertical,
            name: photo.name,
            url: photo.url,
          }),
      ),
      characterizationPhotos: homogeneousGroup.characterization?.photos.map(
        (photo) =>
          new OriginPhotoModel({
            id: photo.id,
            isVertical: photo.isVertical,
            name: photo.name,
            url: photo.photoUrl,
          }),
      ),
    });
  }

  static toModels(data: IOriginMapper[]): OriginModel[] {
    return data.map((Origin) => this.toModel(Origin));
  }
}
