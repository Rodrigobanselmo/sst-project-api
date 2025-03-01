import { OriginPhotoModel } from '@/@v2/security/action-plan/domain/models/origin/origin-photo.model';
import { OriginModel } from '@/@v2/security/action-plan/domain/models/origin/origin.model';
import { HomoTypeEnum } from '@/@v2/shared/domain/enum/security/homo-type.enum';
import { CompanyCharacterizationPhoto, HomogeneousGroup } from '@prisma/client';

export type IOriginMapper = {
  homogeneousGroup: Pick<HomogeneousGroup, 'companyId' | 'id' | 'name' | 'type'> & {
    characterization: {
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
    return new OriginModel({
      id: homogeneousGroup.id,
      name: homogeneousGroup.name,
      type: homogeneousGroup.type as HomoTypeEnum,
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
