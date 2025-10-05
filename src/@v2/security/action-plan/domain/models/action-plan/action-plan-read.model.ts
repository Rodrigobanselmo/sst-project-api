import { OriginTypeEnum } from '@/@v2/shared/domain/enum/security/origin-type.enum';
import { ActionPlanReadPhotoModel } from './action-plan-read-photo.model';

export type IActionPlanReadModel = {
  uuid: { id?: string; riskDataId: string; recommendationId: string; workspaceId: string };
  companyId: string;
  name: string;
  type: OriginTypeEnum;

  characterizationPhotos: ActionPlanReadPhotoModel[];
  recommendation: {
    name: string;
    photos: ActionPlanReadPhotoModel[];
  };
  generateSources: {
    id: string;
    name: string;
  }[];
};

export class ActionPlanReadModel {
  uuid: { id?: string; riskDataId: string; recommendationId: string; workspaceId: string };
  companyId: string;
  name: string;
  type: OriginTypeEnum;

  characterizationPhotos: ActionPlanReadPhotoModel[];
  recommendation: {
    name: string;
    photos: ActionPlanReadPhotoModel[];
  };
  generateSources: {
    id: string;
    name: string;
  }[];

  constructor(params: IActionPlanReadModel) {
    this.uuid = params.uuid;
    this.name = params.name;
    this.type = params.type;
    this.companyId = params.companyId;

    this.recommendation = params.recommendation;
    this.characterizationPhotos = params.characterizationPhotos;
    this.generateSources = params.generateSources;
  }
}
