import { ActionPlanReadPhotoModel } from '@/@v2/security/action-plan/domain/models/action-plan/action-plan-read-photo.model';
import { ActionPlanReadModel } from '@/@v2/security/action-plan/domain/models/action-plan/action-plan-read.model';
import { HierarchyTypeEnum } from '@/@v2/shared/domain/enum/company/hierarchy-type.enum';
import { CharacterizationTypeEnum } from '@/@v2/shared/domain/enum/security/characterization-type.enum';
import { HomoTypeEnum } from '@/@v2/shared/domain/enum/security/homo-type.enum';
import { getOriginHomogeneousGroup } from '@/@v2/shared/domain/functions/security/get-origin-homogeneous-group.func';
import { CharacterizationTypeEnum as PrismaCharacterizationTypeEnum, CompanyCharacterizationPhoto, HomogeneousGroup, HierarchyEnum } from '@prisma/client';

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
      photos: CompanyCharacterizationPhoto[];
    } | null;
    riskFactorData: {
      recs: {
          recName: string;
      }[];
  }[]
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
};

export class ActionPlanReadMapper {
  static toModel({ homogeneousGroup, photos }: IActionPlanReadMapper): ActionPlanReadModel {
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
      id: homogeneousGroup.id,
      name: origin.name,
      type: origin.type,
      companyId: homogeneousGroup.companyId,
      recommendation: {
        name: homogeneousGroup.riskFactorData[0].recs[0].recName,
        photos: photos.map(
          (photo) =>
            new ActionPlanReadPhotoModel({
              id: photo.id,
              isVertical: photo.is_vertical,
              name: photo.file.name,
              url: photo.file.url,
            }),
        )
      },
      characterizationPhotos: homogeneousGroup.characterization?.photos.map(
        (photo) =>
          new ActionPlanReadPhotoModel({
            id: photo.id,
            isVertical: photo.isVertical,
            name: photo.name,
            url: photo.photoUrl,
          }),
      ),
    });
  }

  static toModels(data: IActionPlanReadMapper[]): ActionPlanReadModel[] {
    return data.map((ActionPlan) => this.toModel(ActionPlan));
  }
}
