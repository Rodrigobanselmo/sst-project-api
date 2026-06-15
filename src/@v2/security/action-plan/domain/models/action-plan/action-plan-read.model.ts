import { OriginTypeEnum } from '@/@v2/shared/domain/enum/security/origin-type.enum';
import { ActionPlanStatusEnum } from '../../enums/action-plan-status.enum';
import { ActionPlanReadPhotoModel } from './action-plan-read-photo.model';
import { ActionPlanEffectivenessModel, IActionPlanEffectivenessModel } from './action-plan-effectiveness.model';
import { ActionPlanPlanningModel, IActionPlanPlanningModel } from './action-plan-planning.model';

export type IActionPlanReadModel = {
  uuid: { id?: string; riskDataId: string; recommendationId: string; workspaceId: string };
  companyId: string;
  name: string;
  type: OriginTypeEnum;
  status: ActionPlanStatusEnum;
  validDate: Date | null;
  responsible: { id: string; name: string } | null;

  characterizationPhotos: ActionPlanReadPhotoModel[];
  recommendation: {
    name: string;
    photos: ActionPlanReadPhotoModel[];
  };
  generateSources: {
    id: string;
    name: string;
  }[];
  planning: IActionPlanPlanningModel;
  effectiveness: IActionPlanEffectivenessModel;
  exposedWorkersCount: number;
};

export class ActionPlanReadModel {
  uuid: { id?: string; riskDataId: string; recommendationId: string; workspaceId: string };
  companyId: string;
  name: string;
  type: OriginTypeEnum;
  status: ActionPlanStatusEnum;
  validDate: Date | null;
  responsible: { id: string; name: string } | null;

  characterizationPhotos: ActionPlanReadPhotoModel[];
  recommendation: {
    name: string;
    photos: ActionPlanReadPhotoModel[];
  };
  generateSources: {
    id: string;
    name: string;
  }[];
  planning: ActionPlanPlanningModel;
  effectiveness: ActionPlanEffectivenessModel;
  exposedWorkersCount: number;

  constructor(params: IActionPlanReadModel) {
    this.uuid = params.uuid;
    this.name = params.name;
    this.type = params.type;
    this.companyId = params.companyId;
    this.status = params.status;
    this.validDate = params.validDate;
    this.responsible = params.responsible;

    this.recommendation = params.recommendation;
    this.characterizationPhotos = params.characterizationPhotos;
    this.generateSources = params.generateSources;
    this.planning = new ActionPlanPlanningModel(params.planning);
    this.effectiveness = new ActionPlanEffectivenessModel(params.effectiveness);
    this.exposedWorkersCount = params.exposedWorkersCount ?? 0;
  }
}
