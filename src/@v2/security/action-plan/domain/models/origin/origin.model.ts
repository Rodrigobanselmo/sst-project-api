import { OriginTypeEnum } from '@/@v2/shared/domain/enum/security/origin-type.enum';
import { OriginPhotoModel } from './origin-photo.model';

export type IOriginModel = {
  id: string;
  companyId: string;
  name: string;
  type: OriginTypeEnum;

  recommendationPhotos: OriginPhotoModel[];
  characterizationPhotos: OriginPhotoModel[];
};

export class OriginModel {
  id: string;
  companyId: string;
  name: string;
  type: OriginTypeEnum;

  recommendationPhotos: OriginPhotoModel[];
  characterizationPhotos: OriginPhotoModel[];

  constructor(params: IOriginModel) {
    this.id = params.id;
    this.name = params.name;
    this.type = params.type;
    this.companyId = params.companyId;

    this.recommendationPhotos = params.recommendationPhotos;
    this.characterizationPhotos = params.characterizationPhotos;
  }
}
