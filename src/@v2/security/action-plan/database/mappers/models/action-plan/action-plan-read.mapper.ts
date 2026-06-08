import { ActionPlanReadPhotoModel } from '@/@v2/security/action-plan/domain/models/action-plan/action-plan-read-photo.model';
import { ActionPlanReadModel } from '@/@v2/security/action-plan/domain/models/action-plan/action-plan-read.model';
import { ActionPlanStatusEnum } from '@/@v2/security/action-plan/domain/enums/action-plan-status.enum';
import { EffectivenessStatusEnum } from '@/@v2/security/action-plan/domain/enums/effectiveness-status.enum';
import { calculateActionPlanValidDate } from '@/@v2/security/action-plan/domain/functions/calculate-action-plan-valid-date.func';
import { HierarchyTypeEnum } from '@/@v2/shared/domain/enum/company/hierarchy-type.enum';
import { CharacterizationTypeEnum } from '@/@v2/shared/domain/enum/security/characterization-type.enum';
import { HomoTypeEnum } from '@/@v2/shared/domain/enum/security/homo-type.enum';
import { getOriginHomogeneousGroup } from '@/@v2/shared/domain/functions/security/get-origin-homogeneous-group.func';
import {
  CharacterizationTypeEnum as PrismaCharacterizationTypeEnum,
  CompanyCharacterizationPhoto,
  EffectivenessStatusEnum as PrismaEffectivenessStatusEnum,
  HomogeneousGroup,
  HierarchyEnum,
  CharacterizationPhotoRecommendation,
  StatusEnum,
} from '@prisma/client';
import { IActionPlanDAO } from '../../../dao/action-plan/action-plan.types';

export type IActionPlanReadMapper = {
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
      photos: (CompanyCharacterizationPhoto & {
        characterizationPhotoRecommendation: CharacterizationPhotoRecommendation[];
      })[];
    } | null;
    riskFactorData: {
      recs: {
        recMed: {
          recName: string | null;
        };
      }[];
    }[];
  };

  photos: {
    id: string;
    is_vertical: boolean;
    file_id: string;
    deleted_at: Date | null;
    risk_data_rec_id: string;

    file: {
      name: string;
      url: string;
      created_at: Date;
      updated_at: Date;
    };
  }[];

  actionPlan: {
    id: string;
    status: StatusEnum;
    endDate: Date | null;
    responsibleId: number | null;
    monitoringMethod: string | null;
    resultCriteria: string | null;
    effectivenessStatus: PrismaEffectivenessStatusEnum;
    effectivenessDate: Date | null;
    effectivenessComment: string | null;
    responsible: { id: number; name: string | null } | null;
    effectivenessBy: { id: number; name: string | null } | null;
  } | null;

  generateSources: {
    id: string;
    name: string;
  }[];

  documentData: {
    validityStart: Date | null;
    months_period_level_2: number;
    months_period_level_3: number;
    months_period_level_4: number;
    months_period_level_5: number;
  } | null;

  riskLevel: number | null;

  params: IActionPlanDAO.FindParams;
};

export class ActionPlanReadMapper {
  static toModel({
    homogeneousGroup,
    photos,
    actionPlan,
    generateSources,
    documentData,
    riskLevel,
    params,
  }: IActionPlanReadMapper): ActionPlanReadModel {
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

    const validDate = calculateActionPlanValidDate({
      level: riskLevel,
      monthsPeriodLevel_2: documentData?.months_period_level_2 ?? 24,
      monthsPeriodLevel_3: documentData?.months_period_level_3 ?? 12,
      monthsPeriodLevel_4: documentData?.months_period_level_4 ?? 6,
      monthsPeriodLevel_5: documentData?.months_period_level_5 ?? 3,
      validityStart: documentData?.validityStart ?? null,
      validDate: actionPlan?.endDate ?? null,
    });

    return new ActionPlanReadModel({
      uuid: {
        id: actionPlan?.id || undefined,
        recommendationId: params.recommendationId,
        riskDataId: params.riskDataId,
        workspaceId: params.workspaceId,
      },
      name: origin.name,
      type: origin.type,
      companyId: homogeneousGroup.companyId,
      status: actionPlan?.status ? ActionPlanStatusEnum[actionPlan.status] : ActionPlanStatusEnum.PENDING,
      validDate,
      responsible:
        actionPlan?.responsible?.id && actionPlan.responsible.name
          ? {
              id: String(actionPlan.responsible.id),
              name: actionPlan.responsible.name,
            }
          : null,
      recommendation: {
        name: homogeneousGroup.riskFactorData[0].recs[0].recMed.recName || '',
        photos: photos.map(
          (photo) =>
            new ActionPlanReadPhotoModel({
              id: photo.id,
              isVertical: photo.is_vertical,
              name: photo.file.name,
              url: photo.file.url,
              updatedAt: photo.file.updated_at,
            }),
        ),
      },
      characterizationPhotos:
        homogeneousGroup.characterization?.photos.map(
          (photo) =>
            new ActionPlanReadPhotoModel({
              id: photo.id,
              isVertical: photo.isVertical,
              name: photo.name,
              url: photo.photoUrl,
              isVisible: photo.characterizationPhotoRecommendation.length
                ? photo.characterizationPhotoRecommendation.some((rec) => rec.is_visible)
                : true,
              updatedAt: photo.updated_at,
            }),
        ) || [],
      generateSources: generateSources.map((source) => ({
        id: source.id,
        name: source.name,
      })),
      planning: {
        monitoringMethod: actionPlan?.monitoringMethod ?? null,
        resultCriteria: actionPlan?.resultCriteria ?? null,
      },
      effectiveness: {
        status: actionPlan?.effectivenessStatus
          ? EffectivenessStatusEnum[actionPlan.effectivenessStatus]
          : EffectivenessStatusEnum.NOT_EVALUATED,
        date: actionPlan?.effectivenessDate ?? null,
        comment: actionPlan?.effectivenessComment ?? null,
        evaluatedBy:
          actionPlan?.effectivenessBy?.id && actionPlan.effectivenessBy.name
            ? {
                id: String(actionPlan.effectivenessBy.id),
                name: actionPlan.effectivenessBy.name,
              }
            : null,
      },
    });
  }

  static toModels(data: IActionPlanReadMapper[]): ActionPlanReadModel[] {
    return data.map((ActionPlan) => this.toModel(ActionPlan));
  }
}
