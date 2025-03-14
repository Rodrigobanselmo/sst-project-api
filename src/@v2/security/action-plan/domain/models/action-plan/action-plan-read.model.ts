import { OriginTypeEnum } from '@/@v2/shared/domain/enum/security/origin-type.enum';
import { ActionPlanReadPhotoModel } from './action-plan-read-photo.model';

export type IActionPlanReadModel = {
  id: string;
  companyId: string;
  name: string;
  type: OriginTypeEnum;

  characterizationPhotos: ActionPlanReadPhotoModel[];
  recommendation: {
    name: string;
    photos:ActionPlanReadPhotoModel[];
  }
};

export class ActionPlanReadModel {
  id: string;
  companyId: string;
  name: string;
  type: OriginTypeEnum;

  characterizationPhotos: ActionPlanReadPhotoModel[];
  recommendation: {
    name: string;
    photos:ActionPlanReadPhotoModel[];
  }

  constructor(params: IActionPlanReadModel) {
    this.id = params.id;
    this.name = params.name;
    this.type = params.type;
    this.companyId = params.companyId;

    this.recommendation = params.recommendation;
    this.characterizationPhotos = params.characterizationPhotos;
  }
}
