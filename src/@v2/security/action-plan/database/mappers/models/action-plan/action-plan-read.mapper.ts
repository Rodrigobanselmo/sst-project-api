import { ActionPlanReadPhotoModel } from '@/@v2/security/action-plan/domain/models/action-plan/action-plan-read-photo.model';
import { ActionPlanReadModel } from '@/@v2/security/action-plan/domain/models/action-plan/action-plan-read.model';
import { HierarchyTypeEnum } from '@/@v2/shared/domain/enum/company/hierarchy-type.enum';
import { CharacterizationTypeEnum } from '@/@v2/shared/domain/enum/security/characterization-type.enum';
import { HomoTypeEnum } from '@/@v2/shared/domain/enum/security/homo-type.enum';
import { getOriginHomogeneousGroup } from '@/@v2/shared/domain/functions/security/get-origin-homogeneous-group.func';
import { CharacterizationTypeEnum as PrismaCharacterizationTypeEnum, CompanyCharacterizationPhoto, HomogeneousGroup, HierarchyEnum, CharacterizationPhotoRecommendation } from '@prisma/client';
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
  } | null;

  params: IActionPlanDAO.FindParams;
};

export class ActionPlanReadMapper {
  static toModel({ homogeneousGroup, photos, actionPlan, params }: IActionPlanReadMapper): ActionPlanReadModel {
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
              isVisible: photo.characterizationPhotoRecommendation.length ? photo.characterizationPhotoRecommendation.some((rec) => rec.is_visible) : true,
              updatedAt: photo.updated_at,
            }),
        ) || [],
    });
  }

  static toModels(data: IActionPlanReadMapper[]): ActionPlanReadModel[] {
    return data.map((ActionPlan) => this.toModel(ActionPlan));
  }
}
